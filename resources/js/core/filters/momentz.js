import store from '@js/store'
const configs = store.getters['config/configs']
const vars = store.getters['config/vars']

const getActiveConfigs = () => {
    return {
        timezone: configs.system.timezone,
        defaultDateFormat: vars.defaultDateFormat,
        defaultDateTimeFormat: vars.defaultDateTimeFormat,
        serverDateFormat: vars.serverDateFormat,
        serverDateTimeFormat: vars.serverDateTimeFormat,
        calendarLocale: {
            // lastDay: '[Yesterday]',
            sameDay: vars.defaultTimeFormat,
            lastWeek: vars.defaultDateFormat,
            sameElse: vars.defaultDateFormat
        }
    }
}

export const momentDate = (value, formatOption) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment(value, activeConfigs.serverDateFormat)

    if(!value) {
        return 'INVALID DATE STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment(value[0], value[1])
    }

    return momentObj.format(formatOption || activeConfigs.defaultDateFormat)
}

export const momentTime = (value, formatOption) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment(value, activeConfigs.serverTimeFormat)

    if(!value) {
        return 'INVALID TIME STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment(value[0], value[1])
    }

    return momentObj.format(formatOption || activeConfigs.defaultTimeFormat)
}

export const momentDateTime = (value, formatOption) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment(value, activeConfigs.serverDateTimeFormat)

    if(!value) {
        return 'INVALID DATE TIME STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment(value[0], value[1])
    }

    return momentObj.format(formatOption || activeConfigs.defaultDateTimeFormat)
}

export const momentCalendar = (value, calendarOption) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment(value, activeConfigs.serverDateTimeFormat)

    if(!value) {
        return 'INVALID DATE TIME STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment(value[0], value[1])
    }

    return momentObj.calendar(calendarOption ? calendarOption : activeConfigs.calendarLocale)
}

export const momentTimeTz = (value, formatOption, timezoneOption) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment.utc(`${moment().format(activeConfigs.serverDateFormat)} ${value}`, activeConfigs.serverTimeFormat)

    if(!value) {
        return 'INVALID TIME STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment.utc(value[0], value[1])
    }

    return momentObj.tz(timezoneOption || activeConfigs.timezone).format(formatOption || activeConfigs.defaultTimeFormat)
}

export const momentDateTimeTz = (value, formatOption, timezoneOption) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment.utc(value, activeConfigs.serverDateTimeFormat)

    if(!value) {
        return 'INVALID DATE TIME STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment.utc(value[0], value[1])
    }

    return momentObj.tz(timezoneOption || activeConfigs.timezone).format(formatOption || activeConfigs.defaultDateTimeFormat)
}

export const momentCalendarTz = (value, calendarOption = null, timezoneOption = null) => {
    const activeConfigs = getActiveConfigs()
    let momentObj = moment.utc(value, activeConfigs.serverDateTimeFormat)

    if(!value) {
        return 'INVALID DATE TIME STRING'
    }

    if(Array.isArray(value)) {
        momentObj = moment.utc(value[0], value[1])
    }

    let result = momentObj.tz(timezoneOption || activeConfigs.timezone)
    result = result.calendar(calendarOption ? calendarOption : activeConfigs.calendarLocale)
    return result
}

export default { momentDate, momentTime, momentDateTime, momentCalendar, momentTimeTz, momentDateTimeTz, momentCalendarTz }