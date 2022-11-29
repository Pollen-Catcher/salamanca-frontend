import * as yup from 'yup'
export const schema = yup.object().shape({
  name: yup.string().required('Please enter your username'),
  email: yup
    .string()
    .email('Please enter a valid email format')
    .required('Please enter your e-mail'),
  password: yup
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Please enter your password'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
})
