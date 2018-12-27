const errorHandler = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Podany e-mail już istnieje.'
    case 'auth/invalid-email':
      return 'Blędny e-mail.'
    case 'auth/operation-not-allowed':
      return 'Rejestracja jest zablokowana.'
    case 'auth/weak-password':
      return 'Zbyt proste hasło.'
    case 'auth/user-disabled':
      return 'Użytkownik został zablokowany.'
    case 'auth/user-not-found':
      return 'Użytkownik nie istnieje.'
    case 'auth/wrong-password':
      return 'Błędne hasło.'
  }
}

export default errorHandler
