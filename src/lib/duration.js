'use strict'

/**
 * Add a leading zero to a number and return a string value
 * @param number
 * @returns {string}
 */
let leadingZero = (number) => {
  if (number > 10) {
    return number.toString()
  }

  return '0' + number.toString()
}

/**
 * Format duration to format of HH:MM:SS,MS
 * @param hours
 * @param minutes
 * @param seconds
 * @param ms
 * @returns {string}
 */
let formatDuration = (hours, minutes, seconds, ms) => {
  return leadingZero(hours) + ':' + leadingZero(minutes) + ':' + leadingZero(seconds) + ',' + leadingZero(ms)
}

/**
 * Duration
 * @type {{toMilliseconds: (function(*=)), toDuration: (function(*))}}
 */
module.exports = {
  toMilliseconds (duration) {
    if (!duration) {
      return 0
    }

    let matches = duration.match(/(\d+)\:(\d+)\:(\d+),(\d+)/)
    if (matches.length !== 5) {
      return 0
    }

    let hours = parseInt(matches[1])
    let minutes = parseInt(matches[2])
    let seconds = parseInt(matches[3])
    let ms = parseInt(matches[4])

    return ms + seconds * 1000 + minutes * 60000 + hours * 3600000
  },

  toDuration (milliseconds) {
    let hours = Math.floor(milliseconds / 3600000)
    let minutes = Math.floor(milliseconds / 60000) - hours * 60
    let seconds = Math.floor(milliseconds / 1000) - hours * 3600 - minutes * 60
    let ms = milliseconds - seconds * 1000 - hours * 3600000 - minutes * 60000

    return formatDuration(hours, minutes, seconds, ms)
  }
}
