import * as yup from 'yup'

function getLocalDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseLocalDate(dateString) {
  if (!dateString) {
    return null
  }

  const [year, month, day] = dateString.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

export function getHabitDateBounds() {
  const today = new Date()
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const minDate = new Date(maxDate)

  minDate.setMonth(minDate.getMonth() - 1)

  return {
    minDate,
    maxDate,
    minDateString: getLocalDateString(minDate),
    maxDateString: getLocalDateString(maxDate),
  }
}

export const habitSchema = yup.object({
  date: yup
    .string()
    .required('Informe uma data.')
    .test('valid-date-format', 'Informe uma data valida.', (value) => {
      const parsedDate = parseLocalDate(value)
      return parsedDate instanceof Date && !Number.isNaN(parsedDate.getTime())
    })
    .test(
      'min-date',
      'A data deve estar dentro de no máximo um mes atras.',
      (value) => {
        const parsedDate = parseLocalDate(value)

        if (!parsedDate) {
          return false
        }

        return parsedDate >= getHabitDateBounds().minDate
      }
    )
    .test(
      'max-date',
      'Não é possível criar registros no futuro.',
      (value) => {
        const parsedDate = parseLocalDate(value)

        if (!parsedDate) {
          return false
        }

        return parsedDate <= getHabitDateBounds().maxDate
      }
    ),
  waterIntakeMl: yup
    .number()
    .typeError('Informe o consumo de agua em ml.')
    .required('Informe o consumo de agua.')
    .integer('O consumo de agua deve ser um numero inteiro.')
    .min(1, 'O consumo de agua deve ser de no minimo 1 ml.'),
  activityMinutes: yup
    .number()
    .typeError('Informe os minutos de atividade.')
    .required('Informe o tempo de atividade.')
    .integer('A atividade deve ser informada em minutos inteiros.')
    .min(1, 'A atividade deve ser de no minimo 1 minuto.'),
  mood: yup
    .string()
    .trim()
    .required('Informe o humor.')
    .min(2, 'O humor deve ter pelo menos 2 caracteres.')
    .max(30, 'O humor deve ter no maximo 30 caracteres.'),
  notes: yup
    .string()
    .max(500, 'As observacoes devem ter no maximo 500 caracteres.')
    .nullable(),
})

export async function validateHabitForm(form) {
  try {
    const validatedData = await habitSchema.validate(
      {
        ...form,
        mood: form.mood?.trim(),
        notes: form.notes?.trim() || '',
      },
      { abortEarly: false }
    )

    return { data: validatedData, errors: {} }
  } catch (error) {
    const fieldErrors = {}

    error.inner?.forEach((issue) => {
      if (issue.path && !fieldErrors[issue.path]) {
        fieldErrors[issue.path] = issue.message
      }
    })

    return { data: null, errors: fieldErrors }
  }
}
