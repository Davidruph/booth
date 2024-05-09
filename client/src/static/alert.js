import Swal from "sweetalert2";

const showAlert = (title, message, type) => {
  Swal.fire({
    title: title,
    text: message,
    icon: type,
    showCancelButton: false,
    showConfirmButton: false,
    confirmButtonText: "Continue",
    timer: 2000,
  });
};

export { showAlert };
