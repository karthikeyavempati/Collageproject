import React, { useState, useEffect } from 'react';
import { PortalRole, InternshipRole, Candidate, ApplicationFormData, UserSession, PendingCompany } from './types';
import { 
  INITIAL_INTERNSHIPS, 
  INITIAL_CANDIDATES, 
  STATE_DISTRIBUTIONS, 
  VERIFICATION_BATCHES,
  PENDING_COMPANIES
} from './data/mockData';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { NotFoundPage } from './components/NotFoundPage';
import { ApplicationModal } from './components/ApplicationModal';
import { NewPostingModal } from './components/NewPostingModal';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { AICoachDrawer } from './components/AICoachDrawer';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [activeRole, setActiveRole] = useState<PortalRole>('landing');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isUnknownPath, setIsUnknownPath] = useState(false);
  const [internships, setInternships] = useState<InternshipRole[]>(INITIAL_INTERNSHIPS);
  const [appliedRoleIds, setAppliedRoleIds] = useState<string[]>(['pm-01']);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [stateDistributions, setStateDistributions] = useState(STATE_DISTRIBUTIONS);
  const [verificationBatches, setVerificationBatches] = useState(VERIFICATION_BATCHES);
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>(PENDING_COMPANIES);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  // Modals & Drawers state
  const [applyingRole, setApplyingRole] = useState<InternshipRole | null>(null);
  const [isNewPostingOpen, setIsNewPostingOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // This is a single-page app - every in-app view is reached through
  // `activeRole` state, never through the URL. So any path other than the
  // root ("/") means a broken or mistyped link, and should show the 404 page
  // rather than silently falling back to the landing page.
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && path !== '') {
      setIsUnknownPath(true);
    }
  }, []);

  // Attaches the logged-in user's Bearer token to a fetch call, if present.
  const authHeaders = (extra?: Record<string, string>): Record<string, string> => ({
    ...(extra || {}),
    ...(userSession?.token ? { Authorization: `Bearer ${userSession.token}` } : {}),
  });

  // Fetch public listings on mount - no auth required for the job board itself.
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const internshipsRes = await fetch('/api/internships');
        if (internshipsRes.ok) {
          const data = await internshipsRes.json();
          setInternships(data);
        }
      } catch (err) {
        console.warn('Backend API fetching fallback to local state:', err);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchPublicData();
  }, []);

  // Candidate pipeline data is sensitive (applicant PII) and now requires an
  // authenticated employer/admin session - fetch it once we have one.
  useEffect(() => {
    if (!userSession || (userSession.role !== 'employer' && userSession.role !== 'admin')) return;
    (async () => {
      try {
        const res = await fetch('/api/candidates', { headers: authHeaders() });
        if (res.ok) setCandidates(await res.json());
      } catch (err) {
        console.warn('Failed to load candidates:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSession]);

  // Admin analytics endpoints require an authenticated admin session.
  useEffect(() => {
    if (!userSession || userSession.role !== 'admin') return;
    (async () => {
      try {
        const [statesRes, batchesRes] = await Promise.all([
          fetch('/api/state-distributions', { headers: authHeaders() }),
          fetch('/api/verification-batches', { headers: authHeaders() }),
        ]);
        if (statesRes.ok) setStateDistributions(await statesRes.json());
        if (batchesRes.ok) setVerificationBatches(await batchesRes.json());
      } catch (err) {
        console.warn('Failed to load admin analytics:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSession]);

  // Handlers
  const handleOpenApplyModal = (role: InternshipRole) => {
    setApplyingRole(role);
  };

  const handleApplicationSubmit = async (formData: ApplicationFormData) => {
    if (applyingRole) {
      if (!appliedRoleIds.includes(applyingRole.id)) {
        try {
          const response = await fetch(`/api/internships/${applyingRole.id}/apply`, {
            method: 'POST',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(formData)
          });

          if (response.ok) {
            const result = await response.json();
            setAppliedRoleIds((prev) => [...prev, applyingRole.id]);
            
            // Update local state with API response
            setInternships((prev) =>
              prev.map((item) =>
                item.id === applyingRole.id ? result.updatedRole : item
              )
            );
            setCandidates((prev) => [result.candidate, ...prev]);

            addToast('success', 'Application Submitted Successfully!', `Your application for ${applyingRole.title} has been received and verified by backend service.`);
          } else {
            // Local state fallback
            setAppliedRoleIds((prev) => [...prev, applyingRole.id]);
            setInternships((prev) =>
              prev.map((item) =>
                item.id === applyingRole.id
                  ? { ...item, applicantsCount: item.applicantsCount + 1 }
                  : item
              )
            );
            addToast('success', 'Application Submitted!', `Your application for ${applyingRole.title} has been received.`);
          }
        } catch (err) {
          setAppliedRoleIds((prev) => [...prev, applyingRole.id]);
          addToast('success', 'Application Submitted!', `Your application for ${applyingRole.title} has been logged.`);
        }
      } else {
        addToast('info', 'Already Applied', `You have already submitted an application for ${applyingRole.title}.`);
      }
    }
    setApplyingRole(null);
  };

  const handleCreatePosting = async (newRoleData: Omit<InternshipRole, 'id' | 'applicantsCount'>) => {
    try {
      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newRoleData)
      });

      if (response.ok) {
        const createdRole = await response.json();
        setInternships((prev) => [createdRole, ...prev]);
        addToast('success', 'New Role Published!', `"${createdRole.title}" is now live on the PM Internship Scheme portal API.`);
      } else {
        const fallbackRole: InternshipRole = {
          ...newRoleData,
          id: `pm-${Date.now()}`,
          applicantsCount: 0,
          matchScore: 95
        };
        setInternships((prev) => [fallbackRole, ...prev]);
        addToast('success', 'New Role Published!', `"${fallbackRole.title}" is live.`);
      }
    } catch (err) {
      const fallbackRole: InternshipRole = {
        ...newRoleData,
        id: `pm-${Date.now()}`,
        applicantsCount: 0,
        matchScore: 95
      };
      setInternships((prev) => [fallbackRole, ...prev]);
      addToast('success', 'New Role Published!', `"${fallbackRole.title}" is live.`);
    }
    setIsNewPostingOpen(false);
  };

  const handleCandidateStatusChange = async (candidateId: string, newStatus: Candidate['status']) => {
    try {
      await fetch(`/api/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn('API status update failed, fallback to state:', err);
    }

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }

    addToast('success', 'Candidate Status Updated', `Candidate marked as "${newStatus}".`);
  };

  const handleApproveVerificationBatch = async (batchId: string) => {
    try {
      await fetch(`/api/verification-batches/${encodeURIComponent(batchId)}/approve`, {
        method: 'POST',
        headers: authHeaders()
      });
    } catch (err) {
      console.warn('API batch approval failed, fallback to state:', err);
    }

    setVerificationBatches((prev) => prev.filter((b) => b.id !== batchId));
    addToast('success', 'Verification Batch Processed', `${batchId} records verified and pushed to state registry.`);
  };

  // Company approval workflow for admin dashboard
  const handleApproveCompany = async (companyId: string) => {
    try {
      await fetch(`/api/pending-companies/${companyId}/approve`, {
        method: 'POST',
        headers: authHeaders()
      });
    } catch (err) {
      console.warn('API company approval failed, fallback to state:', err);
    }
    setPendingCompanies(prev =>
      prev.map(c => c.id === companyId ? { ...c, status: 'Approved' as const } : c)
    );
    const company = pendingCompanies.find(c => c.id === companyId);
    addToast('success', 'Company Approved', `${company?.name || 'Company'} has been approved and is now active on the portal.`);
  };

  const handleRejectCompany = async (companyId: string) => {
    try {
      await fetch(`/api/pending-companies/${companyId}/reject`, {
        method: 'POST',
        headers: authHeaders()
      });
    } catch (err) {
      console.warn('API company rejection failed, fallback to state:', err);
    }
    setPendingCompanies(prev =>
      prev.map(c => c.id === companyId ? { ...c, status: 'Rejected' as const } : c)
    );
    const company = pendingCompanies.find(c => c.id === companyId);
    addToast('info', 'Company Rejected', `${company?.name || 'Company'} has been rejected.`);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    addToast('success', `Welcome back, ${session.name}!`, `Authenticated as ${session.role.toUpperCase()} into PM Internship Scheme portal.`);
  };

  const handleLogout = () => {
    setUserSession(null);
    setActiveRole('landing');
    addToast('info', 'Signed Out', 'You have been securely logged out of the portal.');
  };

  // The authenticated-only chrome (dashboard sidebar, "New Posting", AI Coach) must
  // only appear once a real session exists for the role being viewed — never while
  // the Login page itself is on screen.
  const isAuthenticatedForActiveRole = !!userSession && userSession.role === activeRole;

  if (isUnknownPath) {
    return (
      <NotFoundPage
        onNavigateHome={(role) => {
          window.history.replaceState({}, '', '/');
          setIsUnknownPath(false);
          setActiveRole(role);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-900">
      {/* Navigation Header & Mobile Menu */}
      <Navigation
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onOpenNewPosting={() => setIsNewPostingOpen(true)}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        userName={userSession?.name}
        isAuthenticated={isAuthenticatedForActiveRole}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main key={activeRole} className="animate-in fade-in duration-300">
        {activeRole === 'landing' && (
          <LandingPage
            internships={internships}
            onApply={handleOpenApplyModal}
            onNavigateToPortal={setActiveRole}
          />
        )}

        {(activeRole === 'login' || 
         ((activeRole === 'student' || activeRole === 'employer' || activeRole === 'admin') && 
          (!userSession || userSession.role !== activeRole))) && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToPortal={setActiveRole}
            defaultRole={activeRole !== 'login' && activeRole !== 'landing' ? activeRole as 'student' | 'employer' | 'admin' : undefined}
          />
        )}

        {activeRole === 'student' && userSession?.role === 'student' && (
          <StudentDashboard
            internships={internships}
            appliedRoleIds={appliedRoleIds}
            onApply={handleOpenApplyModal}
            onOpenAICoach={() => setIsAICoachOpen(true)}
            userName={userSession.name}
            candidates={candidates}
          />
        )}

        {activeRole === 'employer' && userSession?.role === 'employer' && (
          <EmployerDashboard
            candidates={candidates}
            postings={internships}
            onOpenNewPosting={() => setIsNewPostingOpen(true)}
            onSelectCandidate={setSelectedCandidate}
            onCandidateStatusChange={handleCandidateStatusChange}
            companyName={userSession.name}
          />
        )}

        {activeRole === 'admin' && userSession?.role === 'admin' && (
          <AdminDashboard
            stateDistributions={stateDistributions}
            verificationBatches={verificationBatches}
            onApproveBatch={handleApproveVerificationBatch}
            pendingCompanies={pendingCompanies}
            onApproveCompany={handleApproveCompany}
            onRejectCompany={handleRejectCompany}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      {applyingRole && (
        <ApplicationModal
          role={applyingRole}
          onClose={() => setApplyingRole(null)}
          onSubmit={handleApplicationSubmit}
        />
      )}

      {isNewPostingOpen && (
        <NewPostingModal
          onClose={() => setIsNewPostingOpen(false)}
          onSubmit={handleCreatePosting}
        />
      )}

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleCandidateStatusChange}
        />
      )}

      {isAICoachOpen && (
        <AICoachDrawer onClose={() => setIsAICoachOpen(false)} userName={userSession?.name} />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
