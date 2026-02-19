export function parsePlantData(body: any) {
  const dateFields = [
    "date_planted",
    "last_pruning",
    "last_water",
    "last_fertilized",
    "last_interaction",
  ];
  const decimalFields = ["pref_sun", "pref_air_humidity", "pref_soil_humidity"];
  return parseFields(body, dateFields, decimalFields);
}

export function parseSensorData(body: any) {
  const dateFields = ["timestamp"];
  const decimalFields = [
    "temperature",
    "humidity_air",
    "light_intensity",
    "humidity_soil",
    "co2_amount",
  ];
  return parseFields(body, dateFields, decimalFields);
}

function parseFields(body: any, dateFields: string[], decimalFields: string[]) {
  const data: any = { ...body };

  for (const field of dateFields) {
    if (data[field]) {
      data[field] = new Date(data[field]);
    }
  }

  for (const field of decimalFields) {
    if (data[field] !== undefined && data[field] !== null) {
      data[field] = parseFloat(data[field]);
    }
  }

  return data;
}
