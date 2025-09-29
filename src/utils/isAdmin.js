export const isAdmin = (role) => {
    const roleTrim = role.trim() 

    if (
    roleTrim == "ADMIN CINTAMAMA" ||
    roleTrim == "SUPERADMIN" ||
    roleTrim == "ADMIN ABIMANYU"
  ) {
    return true;
  }
  return false;
};
