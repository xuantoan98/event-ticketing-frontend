export const formatDate = (date) => {
  if (!date) {
    return '---';
  } else {
    return new Date(date).toLocaleDateString('vi-VN');
  }
}

export const formatDateTime = (date) => {
  if (!date) {
    return '---';
  } else {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export const formatRole = (role) => {
  switch(role) {
    case 'admin': 
      return 'Quản trị viên';
    case 'employee':
      return 'Nhân viên';
    case 'customer':
      return 'Khách mời';
  }
}

export const formatCurrencyVND = (value) => {
  if (value == null) {
    return '---';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
