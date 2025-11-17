// NEW FILE: app/components/UserSearchBar.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type UserSummary = {
    _id: string;
    username: string;
    email?: string;
};

type UserSearchBarProps = {
    // username of the currently logged-in user so we can exclude them
    currentUsername?: string;
};

export default function UserSearchBar({ currentUsername }: UserSearchBarProps) {
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState("");
    const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserSummary[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);

    // load all users once
    useEffect(() => {
        async function loadUsers() {
            setLoadingUsers(true);
            setUserError(null);
            try {
                const res = await axios.get(`${API_BASE_URL}/user/all`, {
                    withCredentials: true,
                });
                const users: UserSummary[] = res.data.users || [];

                // exclude current user from the list
                const filtered = users.filter(
                    (u) => !currentUsername || u.username !== currentUsername
                );

                setAllUsers(filtered);
                setFilteredUsers(filtered);
            } catch (err) {
                console.error("Error loading users:", err);
                setUserError("Could not load users.");
            } finally {
                setLoadingUsers(false);
            }
        }

        void loadUsers();
    }, [currentUsername]);

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearchInput(value);

        const q = value.trim().toLowerCase();
        if (!q) {
            // show everyone (except current user)
            setFilteredUsers(allUsers);
            return;
        }

        const matches = allUsers.filter((u) => {
            const name = u.username?.toLowerCase() || "";
            return name.includes(q);
        });

        setFilteredUsers(matches);
    }

    return (
        // same look as before – just moved into a component
        <div className="hidden relative flex-1 max-w-md items-center rounded-2xl border border-brand-stroke bg-slate-900 px-3 py-2 text-sm text-brand-muted sm:flex">
            <input
                type="search"
                placeholder="Search ducks on the pond"
                className="w-full bg-transparent text-xs text-brand-text placeholder:text-brand-muted focus:outline-none"
                value={searchInput}
                onChange={handleSearchChange}
            />

            {searchInput && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-2xl border border-brand-stroke bg-slate-900 shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
                    {loadingUsers && (
                        <div className="px-3 py-2 text-xs text-brand-muted">
                            Loading users...
                        </div>
                    )}

                    {userError && (
                        <div className="px-3 py-2 text-xs text-red-400">{userError}</div>
                    )}

                    {!loadingUsers && !userError && (
                        <>
                            {filteredUsers.length === 0 ? (
                                <div className="px-3 py-2 text-xs text-brand-muted">
                                    No users found.
                                </div>
                            ) : (
                                <ul className="divide-y divide-brand-stroke/60 text-xs">
                                    {filteredUsers.slice(0, 6).map((user) => (
                                        <li
                                            key={user._id}
                                            className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-brand-card"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.preventDefault();
                                                navigate("/profile", {
                                                    state: {
                                                        // EDITTED THIS: keep logged-in user
                                                        username: currentUsername,
                                                        // EDITTED THIS: profile we want to view
                                                        profileUsername: user.username,
                                                    },
                                                });
                                                setSearchInput("");
                                                setFilteredUsers(allUsers);
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium text-brand-text">
                                                    {user.username}
                                                </div>
                                                {/* EDITTED THIS (from earlier): show @username instead of email */}
                                                <div className="text-[0.7rem] text-brand-muted">
                                                    @{user.username}
                                                </div>
                                            </div>
                                            <span className="text-[0.65rem] text-brand-muted">
                                                View
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
