export function statusBadgeColor(data) {
  if (data === 1) {
    return "success";
  } else if (data === 2) {
    return "danger";
  } else if (data === 3) {
    return "warning";
  } else if (data === 101) {
    return "danger";
  } else if (data === 7) {
    return "warning";
  }
  return "warning";
}

export function statusBadgeLabel(data) {
  if (data === 1) {
    return "ACTIVE";
  } else if (data === 2) {
    return "DISABLED";
  } else if (data === 3) {
    return "UNSETTLED";
  } else if (data === 101) {
    return "CLOSED";
  } else if (data === 7) {
    return "PENDING RISK REVIEW";
  }
  return "-";
}

export function statusMetaColor(data) {
  if (data === "ACTIVE") {
    return "success";
  } else if (data === "PAUSED") {
    return "warning";
  }
  return "";
}

export function statusUserColor(data) {
  if (data === true) {
    return "success";
  } else if (data === false) {
    return "danger";
  }
  return "danger";
}

export function statusUserLabel(data) {
  if (data === true) {
    return "ACTIVE";
  } else if (data === false) {
    return "";
  }
  return "suspended";
}

export function statusLearning(data) {
  if (data === "LEARNING") {
    return "warning";
  } else if (data === "SUCCESS") {
    return "success";
  }
  return "";
}

export function statusImgLabel(data) {
  return data === null ? "-" : `OK`;
}

export function statusPublishColor(data) {
  if (data === true) {
    return "success";
  } else if (data === false) {
    return "danger";
  }
  return "danger";
}

export function statusPublishLabel(data) {
  if (data === true) {
    return "Published";
  } else if (data === false) {
    return "Unpublished";
  }
  return "Published";
}