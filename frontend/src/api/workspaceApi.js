import API from "./axios";

/* =========================
   WORKSPACES
========================= */

export const createWorkspace = async (
  data
) => {

  if (
    !data.name?.trim() ||
    !data.description?.trim()
  ) {

    throw new Error(
      "All fields are required"
    );
  }

  return API.post(
    "/workspaces/",
    data
  );
};

export const getWorkspaces = async () => {

  return API.get(
    "/workspaces/"
  );
};

/* =========================
   MEMBERS
========================= */

export const addMember = async (
  workspaceId,
  data
) => {

  if (!data.email?.trim()) {

    throw new Error(
      "Email is required"
    );
  }

  return API.post(
    `/workspaces/${workspaceId}/members`,
    data
  );
};

export const getWorkspaceMembers =
  async (workspaceId) => {

    return API.get(
      `/workspaces/${workspaceId}/members`
    );
  };

export const updateMemberRole =
  async (
    memberId,
    data
  ) => {

    return API.put(
      `/workspaces/members/${memberId}`,
      data
    );
  };

export const removeMember =
  async (memberId) => {

    return API.delete(
      `/workspaces/members/${memberId}`
    );
  };

  export const deleteWorkspace =
  async (workspaceId) => {

    return API.delete(
      `/workspaces/${workspaceId}`
    );
  };