
'use strict';

export const weekDayNames = [
"Dom",
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb"
];

export const monthNames = [
 "Jan",
"Fev",
"Mar",
"Abr",
"Mai",
"Jun",
"Jul",
"Ago",
"Set",
"Out",
"Nov",
"Dez"
];

/**
 * @param {number} dateUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String. Formato: "Domingo, 10 de Janeiro"
 */
export const getDate = function (dateUnix, timezone) {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayName}, ${date.getUTCDate()} de ${monthName}`;
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. Formato: "HH:MM"
 */
export const getTime = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. Formato: "HH"
 */
export const getHours = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');

  return `${hours}h`;
}

/**
 * @param {number} mps Metter per seconds
 * @returns {number} Kilometer per hours
 */
export const mps_to_kmh = mps => {
  const mph = mps * 3600;
  return mph / 1000;
}

export const aqiText = {
  1: {
    level: "Bom",
    message: "A qualidade do ar é considerada satisfatória, e a poluição do ar representa pouco ou nenhum risco."
  },
  2: {
    level: "Razoável",
    message: "A qualidade do ar é aceitável; no entanto, para alguns poluentes, pode haver uma preocupação moderada de saúde para um número muito pequeno de pessoas que são incomumente sensíveis à poluição do ar."
  },
  3: {
    level: "Moderado",
    message: "Membros de grupos sensíveis podem sentir efeitos na saúde. O público em geral provavelmente não será afetado."
  },
  4: {
    level: "Ruim",
    message: "Todos podem começar a sentir efeitos na saúde; membros de grupos sensíveis podem sentir efeitos mais sérios."
  },
  5: {
    level: "Muito Ruim",
    message: "Alertas de condições de emergência. Toda a população pode ser mais afetada."
  }
}