//
// Namespace - Module Pattern.
//
var JQD = (function($) {
	return {
		//
		// Initialize the clock.
		//
		init_clock: function() {
			// Date variables.
			var date_obj = new Date();
			var hour = date_obj.getHours();
			var minute = date_obj.getMinutes();
			var day = date_obj.getDate();
			var year = date_obj.getFullYear();
			var suffix = 'AM';

			// Array for weekday.
			var weekday = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday'
			];

			// Array for month.
			var month = [
				'01',
				'02',
				'03',
				'04',
				'05',
				'06',
				'07',
				'08',
				'09',
				'10',
				'11',
				'12'
			];

			// Assign weekday, month, date, year.
			weekday = weekday[date_obj.getDate()];
			month = month[date_obj.getMonth()];

			// AM or PM?
			if (hour >= 12) {
				suffix = 'PM';
			}

			// Convert to 12-hour.
			if (hour > 12) {
				hour = hour - 12;
			}
			else if (hour === 0) {
				// Display 12:XX instead of 0:XX.
				hour = 12;
			}

			// Leading zero, if needed.
			if (minute < 10) {
				minute = '0' + minute;
			}

			// Build two HTML strings.
			var clock_time = hour + ':' + minute + ' ' + ' ' + suffix ;
			var clock_date = month + '/' + day + '/' + year;

			// Shove in the HTML.
			$('#clock').html(clock_time).attr('title', clock_time);
			$('#weekday').html(clock_date).attr('title', clock_date);

			// Update every 60 seconds.
			setTimeout(JQD.init_clock, 60000);
		},

		//
		// Clear active states, hide menus.
		//
		clear_active: function() {
			$('a.active, tr.active').removeClass('active');
			$('ul.menu').hide();
		},

		//
		// Zero out window z-index.
		//
		window_flat: function() {
			$('div.window').removeClass('window_stack');
		},

		//
		// Resize modal window.
		//
		window_resize: function(el) {
			// Nearest parent window.
			var win = $(el).closest('div.window');

			// Is it maximized already?
			if (win.hasClass('window_full')) {
				// Restore window position.
				win.removeClass('window_full').css({
					'top': win.attr('data-t'),
					'left': win.attr('data-l'),
					'right': win.attr('data-r'),
					'bottom': win.attr('data-b'),
					'width': win.attr('data-w'),
					'height': win.attr('data-h')
				});
			}
			else {
				win.attr({
					// Save window position.
					'data-t': win.css('top'),
					'data-l': win.css('left'),
					'data-r': win.css('right'),
					'data-b': win.css('bottom'),
					'data-w': win.css('width'),
					'data-h': win.css('height')
				}).addClass('window_full').css({
					// Maximize dimensions.
					'top': '0',
					'left': '0',
					'right': '0',
					'bottom': '0',
					'width': '100%',
					'height': '100%'
				});
			}

			// Bring window to front.
			JQD.window_flat();
			win.addClass('window_stack');
		},

		//
		// Initialize the desktop.
		//
		init_desktop: function() {
			if (window.location !== window.top.location) {
				window.top.location = window.location;
			}

			// Start clock.
			JQD.init_clock();

			// Cancel mousedown, right-click.
			$(document).mousedown(function(ev) {
				if (!$(ev.target).closest('a').length) {
					JQD.clear_active();
					return false;
				}
			}).bind('contextmenu', function() {
				return false;
			});

			// Relative or remote links?
			$('a').click(function() {
				var url = $(this).attr('href');
				this.blur();

				if (url.match(/^#/)) {
					return false;
				}
				else if (url.match('://')) {
					$(this).attr('target', '_blank');
					return true;
				}
			});

			// Make top menus active.
			$('a.menu_trigger').mousedown(function() {
				if ($(this).next('ul.menu').is(':hidden')) {
					JQD.clear_active();
					$(this).addClass('active').next('ul.menu').show();
				}
				else {
					JQD.clear_active();
				}
			}).mouseenter(function() {
				// Transfer focus, if already open.
				if ($('ul.menu').is(':visible')) {
					JQD.clear_active();
					$(this).addClass('active').next('ul.menu').show();
				}
			});

			// Desktop icons.
			$('a.icon').mousedown(function() {
				// Highlight the icon.
				JQD.clear_active();
				$(this).addClass('active');
			}).dblclick(function() {
				// Get the link's target.
				var x = $($(this).attr('href'));
				var y = $(x.find('a').attr('href'));

				// Show the taskbar button.
				if (x.is(':hidden')) {
					x.remove().appendTo('#dock').end().show('fast');
				}

				// Bring window to front.
				JQD.window_flat();
				y.addClass('window_stack').show();
			}).draggable({
				revert: true,
				containment: 'parent'
			});

			// Taskbar buttons.
			$('#dock a').live('click', function() {
				// Get the link's target.
				var x = $($(this).attr('href'));

				// Hide, if visible.
				if (x.is(':visible')) {
					x.hide();
				}
				else {
					// Bring window to front.
					JQD.window_flat();
					x.show().addClass('window_stack');
				}

				// Stop the live() click.
				this.blur();
				return false;
			});

			// Make windows movable.
			$('div.window').mousedown(function() {
				// Bring window to front.
				JQD.window_flat();
				$(this).addClass('window_stack');
			}).draggable({
				// Confine to desktop.
				// Movable via top bar only.
				containment: '#desktop',
				handle: 'div.window_top'
			}).resizable({
				containment: '#desktop',
				minWidth: 400,
				minHeight: 200

			// Double-click top bar to resize, ala Windows OS.
			}).find('div.window_top').dblclick(function() {
				JQD.window_resize(this);

			// Double click top bar icon to close, ala Windows OS.
			}).find('img').dblclick(function() {
				// Traverse to the close button, and hide its taskbar button.
				$($(this).closest('div.window_top').find('a.window_close').attr('href')).hide('fast');

				// Close the window itself.
				$(this).closest('div.window').hide();

				// Stop propagation to window's top bar.
				return false;
			});

			// Get action buttons for each window.
			$('a.window_min, a.window_resize, a.window_close').mousedown(function() {
				JQD.clear_active();
				// Stop propagation to window's top bar.
				return false;
			});

			// Minimize the window.
			$('a.window_min').click(function() {
				$(this).closest('div.window').hide();
			});

			// Maximize or restore the window.
			$('a.window_resize').click(function() {
				JQD.window_resize(this);
			});

			// Close the window.
			$('a.window_close').click(function() {
				$(this).closest('div.window').hide();
				$($(this).attr('href')).hide('fast');
			});

			// Show desktop button, ala Windows OS.
			$('#show_desktop').click(function() {
				// If any windows are visible, hide all.
				if ($('div.window:visible').length) {
					$('div.window').hide();
				}
				else {
					// Otherwise, reveal hidden windows that are open.
					$('#dock li:visible a').each(function() {
						$($(this).attr('href')).show();
					});
				}
			});

			$('table.data').each(function() {
				// Add zebra striping, ala Mac OS X.
				$(this).find('tr:even td').addClass('zebra');
			}).find('tr').live('click', function() {
				// Highlight row, ala Mac OS X.
				$(this).closest('tr').addClass('active');
			});

			// Add wallpaper last, to prevent blocking.
			$('body').prepend('<img id="wallpaper" class="abs" src="assets/images/misc/wallpaper.jpg" />');
		}
	};
// Pass in jQuery.
})(jQuery);