import * as Yup from 'yup';

export interface IRIO {
  name: string;
  category: string;
  email: string;
  image?: string;
  description?: string;
  interests?: (string | undefined)[] | undefined;
}

export const AddRIOSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  email: Yup.string().email('Email must be a valid email').required('Email is required'),
  image: Yup.string().optional().url('Image must be a valid URL'),
  description: Yup.string().optional(),
  interests: Yup.array().of(Yup.string()).optional(),
});
