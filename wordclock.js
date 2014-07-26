(function(window, $) {
  var minutes = {
    prefix: 'minute',
    5: 'five', 10: 'ten', 15: 'quarter',
    20: 'twenty', 25: 'twenty five', 30: 'half'
  };

  var hours = {
    prefix: 'hour',
    0: 'twelve', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
    10: 'ten', 11: 'eleven', 12: 'twelve'
  };

  var minutesLiteral = 'minutes';
  var past = 'past';
  var to = 'to';
  var oclock = 'oclock';

  function getClockComponents(hour, minute) {
    var clockComponents = [];

    var minutesRoundedToFive = roundToNearestFive(minute);

    if (minutesRoundedToFive > 0 && minutesRoundedToFive < 60) {
      if (minutesRoundedToFive > 30) {
        minutes[60 - minutesRoundedToFive].split(' ').forEach(function(text) {
          clockComponents.push(minutes.prefix + '.' + text);
        });
        if (minutesRoundedToFive !== 45) {
          clockComponents.push(minutesLiteral);
        }
        clockComponents.push(to);
      } else {
        minutes[minutesRoundedToFive].split(' ').forEach(function(text) {
          clockComponents.push(minutes.prefix + '.' + text);
        });
        if (minutesRoundedToFive !== 30 && minutesRoundedToFive !== 15) {
          clockComponents.push(minutesLiteral);
        }
        clockComponents.push(past);
      }
    }

    if (minutesRoundedToFive > 30) {
      clockComponents.push(hours.prefix + '.' + hours[(hour + 1) % 12]);
    } else {
      clockComponents.push(hours.prefix + '.' + hours[hour % 12]);
    }

    clockComponents.push(oclock);

    return clockComponents;
  }

  function roundToNearestFive(n) {
    var modFive = n % 5;
    return modFive > 2.5 ? n + 5 - modFive : n - modFive;
  }

  function getActiveComponents() {
    var activeComponents = [];
    $('.highlight').each(function() {
      var classNames = [];
      $(this).attr('class').split(/\s+/).forEach(function(className) {
        if (className !== 'highlight') classNames.push(className);
      });
      classNames.sort(function(a, b) {
        if (a === 'minute' || a === 'hour') return -1;
        if (b === 'minute' || b === 'hour') return 1;
        return 0;
      });
      if (activeComponents.indexOf(classNames.join('.')) === -1) {
        activeComponents.push(classNames.join('.'));
      }
    });
    return activeComponents;
  }

  function updateClock() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    var newClockComponents = getClockComponents(hours, minutes);

    var lastHours = minutes === 0 ? hours - 1 : hours;
    var lastMinutes = minutes === 0 ? 60 : minutes - 1;

    var currentClockComponents = getActiveComponents();

    var addClasses = [];
    newClockComponents.forEach(function(component) {
      if (currentClockComponents.indexOf(component) === -1) {
        addClasses.push('td.' + component);
      }
    });

    var removeClasses = [];
    currentClockComponents.forEach(function(component) {
      if (newClockComponents.indexOf(component) === -1) {
        removeClasses.push('td.' + component);
      }
    });

    $(removeClasses.join(',')).removeClass('highlight');
    $(addClasses.join(',')).addClass('highlight');
  }

  var minutePrev = new Date().getMinutes();
  window.setInterval(function() {
    var minuteNow = new Date().getMinutes();
    if (minuteNow !== minutePrev) {
      updateClock();
      minutePrev = minuteNow;
    }
  }, 1000);
  updateClock();
})(window, jQuery);