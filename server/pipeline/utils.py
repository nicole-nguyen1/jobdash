def convertToStringOrNull(field):
  fieldAsString = '\'{0}\''.format(field)
  return fieldAsString if field is not None else 'NULL'