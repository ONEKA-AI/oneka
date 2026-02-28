import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Bell, Loader2, Search, User, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getContacts, type Contact } from "@/services/mockContactsApi";
import { getProjects, type Project } from "@/services/mockProjectsApi";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [contactsError, setContactsError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSearchData = async () => {
      setLoading(true);
      const [projectsResult, contactsResult] = await Promise.allSettled([
        getProjects(),
        getContacts(),
      ]);

      if (!isActive) return;

      if (projectsResult.status === "fulfilled") {
        setProjects(projectsResult.value);
        setProjectsError(null);
      } else {
        setProjects([]);
        setProjectsError("Projects unavailable right now.");
      }

      if (contactsResult.status === "fulfilled") {
        setContacts(contactsResult.value);
        setContactsError(null);
      } else {
        setContacts([]);
        setContactsError("Contacts unavailable right now.");
      }

      setLoading(false);
    };

    loadSearchData();

    return () => {
      isActive = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const showDropdown = normalizedQuery.length > 0;

  const projectMatches = useMemo(() => {
    if (!normalizedQuery) return [];
    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.id,
        project.entity,
        project.county,
        project.sector,
        project.auditStatus,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [projects, normalizedQuery]);

  const contactMatches = useMemo(() => {
    if (!normalizedQuery) return [];
    return contacts.filter((contact) => {
      const haystack = [
        contact.name,
        contact.role,
        contact.organization,
        contact.email,
        contact.phone,
        contact.location,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [contacts, normalizedQuery]);

  const visibleProjects = projectMatches.slice(0, 5);
  const visibleContacts = contactMatches.slice(0, 5);
  const totalResults = projectMatches.length + contactMatches.length;
  const hasErrors = Boolean(projectsError || contactsError);
  const noResultsText = hasErrors
    ? "No matches found in available data."
    : "No matches found.";

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, contacts..."
                className="console-input pl-10 pr-9 w-80"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search projects and contacts"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}

              {showDropdown && (
                <div className="absolute left-0 top-full mt-2 w-80 glass-panel shadow-lg p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Search Results
                    </p>
                    {loading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                  </div>

                  {projectsError && (
                    <p className="text-xs text-status-amber mb-2">{projectsError}</p>
                  )}
                  {contactsError && (
                    <p className="text-xs text-status-amber mb-2">{contactsError}</p>
                  )}

                  {!loading && totalResults === 0 && (
                    <p className="text-sm text-muted-foreground">{noResultsText}</p>
                  )}

                  {!loading && totalResults > 0 && (
                    <div className="space-y-4 max-h-80 overflow-auto pr-1">
                      {visibleProjects.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Projects
                          </p>
                          <div className="space-y-2">
                            {visibleProjects.map((project) => (
                              <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="block rounded-md p-3 bg-secondary/30 hover:bg-accent/40 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{project.name}</p>
                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                      {project.id} | {project.entity}
                                    </p>
                                  </div>
                                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                    {project.county}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {visibleContacts.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Contacts
                          </p>
                          <div className="space-y-2">
                            {visibleContacts.map((contact) => (
                              <a
                                key={contact.id}
                                href={`mailto:${contact.email}`}
                                className="block rounded-md p-3 bg-secondary/30 hover:bg-accent/40 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{contact.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {contact.role} | {contact.organization}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                      {contact.email}
                                    </p>
                                  </div>
                                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                    {contact.location}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <button className="relative p-2 rounded-md hover:bg-accent transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-amber" />
            </button>
            
            <Link
              to="/profile"
              className="flex items-center gap-3 pl-4 border-l border-border hover:text-foreground transition-colors"
              aria-label="Open profile"
            >
              <div className="text-right">
                <p className="text-sm font-medium">Audit Officer</p>
                <p className="text-xs text-muted-foreground">OAG Kenya</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
