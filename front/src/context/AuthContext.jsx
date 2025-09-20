import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true,
  });

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      console.log("User data from API:", data);

      if (!data.user) return null;

      const user = {
        ...data.user,
        _id: data.user._id || data.user.id,
        id: data.user.id || data.user._id,
      };

      if (user.forums) {
        user.forumRoles = {};
        user.forums.forEach((forum) => {
          user.forumRoles[forum.forumId] = forum.role.toLowerCase();
        });
      }

      return user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const getForumRole = (forumId) => {
    if (!authState.user?.forumRoles) return null;
    return authState.user.forumRoles[forumId];
  };

  const updateForumData = (forumId, updateData) => {
    setAuthState((prev) => {
      if (!prev.user?.forums) return prev;

      const updatedForums = prev.user.forums.map((forum) =>
        forum.forumId === forumId ? { ...forum, ...updateData } : forum
      );

      return {
        ...prev,
        user: {
          ...prev.user,
          forums: updatedForums,
          forumRoles: {
            ...prev.user.forumRoles,
            [forumId]:
              updateData.role?.toLowerCase() || prev.user.forumRoles[forumId],
          },
        },
      };
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await fetchUserData(token);
        setAuthState({
          isAuthenticated: !!user,
          token: user ? token : null,
          user,
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          token: null,
          user: null,
          isLoading: false,
        });
      }
    };
    initializeAuth();
  }, []);

  // const login = async (token) => {
  //   const user = await fetchUserData(token);
  //   localStorage.setItem("token", token);
  //   setAuthState({
  //     isAuthenticated: !!user,
  //     token: user ? token : null,
  //     user,
  //     isLoading: false,
  //   });
  // };

  const login = async (token, userData = null) => {
    let user = userData;

    // If user data isn't provided, fetch it
    if (!user) {
      user = await fetchUserData(token);
    }

    localStorage.setItem("token", token);
    setAuthState({
      isAuthenticated: !!user,
      token: user ? token : null,
      user,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
    });
  };

  const setUser = (userData) => {
    setAuthState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...userData,
        _id: userData._id || userData.id || prev.user?._id,
        id: userData.id || userData._id || prev.user?.id,
        ...(userData.forums && {
          forumRoles: userData.forums.reduce((acc, forum) => {
            acc[forum.forumId] = forum.role.toLowerCase();
            return acc;
          }, {}),
        }),
      },
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        setUser,
        getForumRole,
        updateForumData,
        getUserId: () => authState.user?._id || authState.user?.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
