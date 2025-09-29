import Swal from "sweetalert2";

export const handleError = (error) => {
  if (!error.response) {
    Swal.fire("Error", "Network error or server not responding.", "error");
    return;
  }

  const { status, data } = error.response;

  const message = Array.isArray(data?.message)
    ? data.message.join(", ")
    : data?.message || "Something went wrong";

  switch (status) {
    case 400:
      Swal.fire("Bad Request", message, "warning");
      break;

    case 401:
      Swal.fire("Unauthorized", "Please login to continue.", "warning");
      break;

    case 403:
      Swal.fire(
        "Forbidden",
        "You don’t have permission to access this resource.",
        "warning"
      );
      break;

    case 404:
      Swal.fire(
        "Not Found",
        "The requested resource could not be found.",
        "info"
      );
      break;

    case 422:
      Swal.fire("Validation Error", message, "warning");
      break;

    case 429:
      Swal.fire(
        "Too Many Requests",
        "You are sending requests too quickly. Please try again later.",
        "warning"
      );
      break;

    case 500:
      Swal.fire(
        "Server Error",
        "An unexpected error occurred on the server.",
        "error"
      );
      break;

    case 502:
    case 503:
    case 504:
      Swal.fire(
        "Server Unavailable",
        "The server is temporarily unavailable. Please try again later.",
        "error"
      );
      break;

    default:
      Swal.fire("Error", message, "error");
  }
};
