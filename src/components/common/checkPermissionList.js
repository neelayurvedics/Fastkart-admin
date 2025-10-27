
let permissionArrayList;
let storedRole;
const ISSERVER = typeof window === "undefined";

if(!ISSERVER){
   permissionArrayList = localStorage.getItem("account") && JSON.parse(localStorage.getItem("account"))?.permissions || []
   storedRole = localStorage.getItem("role") && JSON.parse(localStorage.getItem("role"));
}else{
  permissionArrayList = []
  storedRole = null;
}

export function checkPermission(dynamicValue) {
  // Admin has access to everything
  if (storedRole?.name === "admin") {
    return true;
  }

  if (typeof dynamicValue === "string") {
    return permissionArrayList?.some((obj) => obj.name === dynamicValue);
  } else if (Array.isArray(dynamicValue)) {
    return dynamicValue.every((value) =>
      permissionArrayList.some((obj) => obj.name === value)
    );
  } else {
    return false;
  }
}
