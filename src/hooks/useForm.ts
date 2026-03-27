import { useState, type ChangeEvent } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T>({ initialValues, onSubmit, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let parsedValue: string | boolean = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setValues({
      ...values,
      [name]: parsedValue,
    });

    // Clear error for this field when user types
    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    onSubmit(values);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
}
