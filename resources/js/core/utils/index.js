// Strings & Chars related
export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp))
        .toString(32)
}

export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

export function getByteLen(val) {
    let len = 0
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1
        } else {
            len += 0.5
        }
    }
    return Math.floor(len)
}

// Time related
function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}

export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    } else {
        return pluralize(~~(between / 86400), ' day')
    }
}

// Numbers related
export function numberFormatter(num, digits) {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1)
                .toFixed(digits)
                .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}

export function toThousandslsFilter(num) {
    return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function formatNumber(number, decimal) {
    if (decimal === undefined)
        decimal = 2;
    return this.roundNumber(number, decimal);
}

export function numberPadding(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1)
        .join(z) + n;
}

export function roundNumber(number, precision) {
    precision = Math.abs(parseInt(precision)) || 0;
    let multiplier = Math.pow(10, precision);
    return (Math.round(number * multiplier) / multiplier);
}

export function roundUpTo(num, upto = 1) {
    return Math.ceil(parseInt(num) / upto) * upto;
}

export function roundUpPriceTo(num, currency, upto = 5) {
    return currency ? formatCurrency.to(roundUpTo(num, upto), currency, true, true) : roundUpTo(num, upto);
}

export function currencyToIndianWords(num = 0) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen ']

    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

    const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/

    if ((num = num.toString())
        .length > 9) {
        throw new Error('overflow') // Does not support converting more than 9 digits yet
    }

    const n = ('000000000' + num)
        .substr(-9)
        .match(regex)
    if (!n) return

    let str = ''
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : ''
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : ''
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : ''
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : ''
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''

    return str.trim()
}

export function currencyToWords(n, custom_join_character) {
    let string = n.toString(),
        units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

    const and = custom_join_character || 'and';

    /* Is number zero? */
    if (parseInt(string) === 0) {
        return 'zero';
    }

    /* Array of units as words */
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    /* Array of scales as words */
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
        return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {

        chunk = parseInt(chunks[i]);

        if (chunk) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split('')
                .reverse()
                .map(parseFloat);

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if (ints[1] === 1) {
                ints[0] += 10;
            }

            /* Add scale word if chunk is not zero and array item exists */
            if ((word = scales[i])) {
                words.push(word);
            }

            /* Add unit word if array item exists */
            if ((word = units[ints[0]])) {
                words.push(word);
            }

            /* Add tens word if array item exists */
            if ((word = tens[ints[1]])) {
                words.push(word);
            }

            /* Add 'and' string after units or tens integer if: */
            if (ints[0] || ints[1]) {

                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if (ints[2] || !i && chunksLen) {
                    words.push(and);
                }

            }

            /* Add hundreds word if array item exists */
            if ((word = units[ints[2]])) {
                words.push(word + ' hundred');
            }

        }

    }

    return words.reverse()
        .join(' ');
}

// Currency related
export const formatCurrency = {
    to: (value, currency, showSymbol = false, showDelimiter = true, precision = true, round = true) => {
        const regex = currency.comma ? new RegExp("(\\d)(?=(\\d{" + currency.comma + "})+(?!\\d))", 'g') : new RegExp("(\\d)(?=(\\d{2})+\\d\\.)", 'g')
        const replaceWith = `$1${currency.delimeter || ','}`

        value = Number(value)

        if (precision) {
            value = value.toFixed(round ? 0 : currency.decimal)
        }

        if (showDelimiter) {
            value = value.replace(regex, replaceWith)
        }

        if (showSymbol) {
            if (currency.prefix) {
                value = currency.prefix + ' ' + value
            }
            if (currency.suffix) {
                value = value + ' ' + currency.suffix
            }
            return value
        }
        return value
    },
    from: (value) => {
        return value
    },
    toWords: (num, currency, prefix = true, suffix = 'Only') => {
        let str = currency.name === 'INR' ? currencyToIndianWords(num) : currencyToWords(num)
        str = prefix ? currency.name + ' ' + str : str
        str = suffix ? str + ' ' + suffix : str
        return str
    }
}

export function formatDecimal(val, dec) {
    return Number((val === 0 ? 0 : Number(val)
        .toFixed(dec)))
}

export function addPercentage(val, perc) {
    return Number(Number(val) * (1 + (Number(perc) / 100)))
}

export function removePercentage(val, perc) {
    return Number(Number(val) / (1 + (Number(perc) / 100)))
}

// Others
export const popupBlockerChecker = {
    check: function(popup_window) {
        let _scope = this;
        if (popup_window) {
            if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                setTimeout(function() {
                    _scope._is_popup_blocked(_scope, popup_window);
                }, 200);
            } else {
                popup_window.onload = function() {
                    _scope._is_popup_blocked(_scope, popup_window);
                };
            }
        } else {
            _scope._displayError();
        }
    },
    _is_popup_blocked: function(scope, popup_window) {
        if ((popup_window.innerHeight > 0) == false) {
            scope._displayError();
        }
    },
    _displayError: function() {
        alert($t('misc.popup_blocker_alert'));
    }
}

export function openWindow(url, title, w, h) {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}

export function calculateTimeDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if (hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
}

export function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


export function saveToStorage(key, value) {
    if(window.localStorage && key) {
        value = Array.isArray(value) || _.isObject(value) ? JSON.stringify(value) : value
        window.localStorage.setItem(key, value)
        return true
    }
    return false
}

export function getFromStorage(key, needParsing = false) {
    if(window.localStorage && key) {
        let toReturn = window.localStorage.getItem(key)
        if(needParsing) {
            toReturn = JSON.parse(toReturn)
        }
        return toReturn || null
    }
    return null
}

export function removeFromStorage(key) {
    if(window.localStorage && key) {
        window.localStorage.removeItem(key)
        return true
    }
    return false
}
