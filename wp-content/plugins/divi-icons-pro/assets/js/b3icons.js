(function( $ ) {
	var divi_module_list = [
		'.et_overlay',
		'.et-pb-icon',
		'.et_pb_shop',
		'.single_add_to_cart_button',
		'.dipi_btt_wrapper',
		'.et_pb_button.et_pb_custom_button_icon',
		'.et_pb_de_mach_view_button .et_pb_button',
		'.et_pb_more_button',
		'.et_pb_dmb_breadcrumbs li[data-icon]',
		'.et_pb_dmb_breadcrumbs a[data-icon]',
		'.dgpc_product_carousel .swiper-button-prev',
		'.dgpc_product_carousel .swiper-button-next',
		'.et_pb_b3_testimonial_grid_slider .swiper-button-next',
		'.et_pb_b3_testimonial_grid_slider .swiper-button-prev',
		'.dipi_blog_slider .swiper-button-next',
		'.dipi_blog_slider .swiper-button-prev',
		'.et_pb_testimonial_slider .swiper-button-next',
		'.et_pb_testimonial_slider .swiper-button-prev',
		'.dipi-blog-slider-main .swiper-button-prev',
		'.dipi-blog-slider-main .swiper-button-next',
		'.swiper-button-prev',
		'.swiper-button-next',
		'.dsm_icon_list_icon',
		'.dp-dfg-search-icon',
		'.dgbc_blog_carousel .dgbc_post_item .dg_read_more_wrapper a',
		'.dnext-sid-text-divider-icon',
		'.dnext-3d-transform-flpb-inner.dnext-3d-flpb-flibbox-icon-front .et_pb_animation_top',
		'.dnext-3d-transform-flpb-inner.dnext-3d-flpb-flibbox-icon-back .et_pb_animation_top',
		'.dnext-flpb-flibbox-front span.dnext-flpb-flibbox-icon-font',
		'.dnext-flpb-flibbox-back span.dnext-flpb-flibbox-icon-back',
		'.dnxt-nie-uih-btn',
		'.dnxte-badge-icon',
		'.dnxte-feature-list-icon',
		'.dnxte-hotspot_icon',
		'.elegantshop-add-button .add_to_cart_button',
		'.elegantshop-add-button .elegantshop-click-etfonts',
		'.elegantshop-nav.elegantshop-carousel-button-prev',
		'.elegantshop-nav.elegantshop-carousel-button-next',
		'.elegantshop-cart-icon'
	];

	var divi_module_list_toggles = [
		'.et-core-control-toggle',
		'.et-fb-form__toggle[data-name="button"]',
		'.et-fb-form__toggle[data-name="button_one"]',
		'.et-fb-form__toggle[data-name="button_two"]',
		'.et-fb-form__toggle[data-name="image"]',
		'.et-fb-form__toggle[data-name="overlay"]',
	];

	var all_divi_module_list          = divi_module_list.join();
	var all_divi_module_list_toggles  = divi_module_list_toggles.join();
	var fb_list        				  = '.et-fb-font-icon-list';
	var fb_frame_selector 			  = 'et-fb-app-frame';

	function is_et_fb_pro() {
		if( $( '#et-fb-app' ).length ) { return true; } // is page builder app
		return false;
	}
	
	if( $('#et-fb-app').length && inIframe() ) {	// frontend visual builder
		var targetNode = document.getElementById( 'et-fb-app' );
		var config = { characterData: true, childList: true, subtree: true, attributes: true };
		var callback = function( mutationsList ) {
			mutationsList.forEach(function (thisMutation) {
				if (  thisMutation.type == "attributes" || thisMutation.type ==  "characterData" ) {
					var target = thisMutation.target;
					if ( $(target).attr('id') === 'et-fb-app' || $(target).attr('id') === 'et_fb_root' || $(target).hasClass('et_pb_section') || $(target).hasClass('et_pb_row') || $(target).hasClass('et_pb_column') ) {
						b3_process_moudle_icons(false)
					}
				}
			});
		}
		var observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	} else { // Frontent
		b3_process_moudle_icons(true)
	}
	if(
		($('#et-fb-app').length && !inIframe()) ||
		($('body.extra_page_et_theme_builder').length && !inIframe()) ||
	 	($('body.divi_page_et_theme_builder').length && !inIframe()) ||
	 	($('body.et-bfb').length && !inIframe())) {

		var targetNode = null;

		if($('#et-fb-app').length)
			targetNode = document.getElementById( 'et-fb-app' );
		else if($('body.divi_page_et_theme_builder').length)
			targetNode = $('body.divi_page_et_theme_builder')[0];
		else if($('body.extra_page_et_theme_builder').length)
			targetNode = $('body.extra_page_et_theme_builder')[0];
		else
			targetNode = $('body.et-bfb')[0];

		var config = { childList: true, subtree: true };
		var callback = function( mutationsList ) {
			mutationsList.forEach(function (thisMutation) {
				if ( thisMutation.type == 'childList' ) {
					if($('.et-fb-font-icon-list').length){
							$('.et-fb-font-icon-list').each(function(i, elem){
								if(!$(elem).hasClass('icons-loaded') ){
									append_b3_icon_list();
									$(elem).addClass('icons-loaded')
								}
							})
					}
				}
			});
		}
		var observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}

	$(document).on('click', fb_list + ' > li', function(e) {
		b3_hide_icons();
		setTimeout(function() {
			b3_process_fb_icon_lists();
			b3_process_icons();
			b3_show_icons();
		}, 100);
	});

	/* Support for Divi FilterGrid */
	if(document.querySelector('.dp-dfg-search-icon')){
		let dfg_observer = new MutationObserver(dfg_callback);
		function dfg_callback (mutations) {
			$('.dp-dfg-search-icon').removeAttr('data-icon')
			b3_process_icons();
		}
		dfg_observer.observe(document.querySelector('.dp-dfg-search-icon'), { characterData: false, attributes: false, childList: true, subtree: false });
	}
	/* End of  Divi FilterGrid */

	/*Support for Divi Supreme popup*/
	if(document.querySelector('.dsm-popup-module')){
		let dsm_observer = new MutationObserver(dsm_callback);
		function dsm_callback (mutation) {
			mutation.forEach(function(record, i){
			if (record.addedNodes && record.addedNodes.length > 0) {
					var hasClass = [].some.call(record.addedNodes, function(el) {
						if(el.classList)
							return el.classList.contains('dsm-popup')
						return false;
					});
					if (hasClass) {
						b3_process_icons();			
					}
				}
			})
		}
		dsm_observer.observe(document.querySelector('#main-content'), { characterData: false, attributes: false, childList: true, subtree: true });
	}
	/*End of Support for Divi Supreme popup*/

	/* Support for Divi FilterGrid */
	if(document.querySelector('.elegantshop-add-button .add_to_cart_button')){
		let dfg_observer = new MutationObserver(dfg_callback);
		function dfg_callback (mutations) { b3_process_icons(); }
		dfg_observer.observe(document.querySelector('.elegantshop-add-button .add_to_cart_button'), { childList: true  });
	}
 	/* End of  Divi FilterGrid */
	
	$(document).ajaxComplete(function() {
		b3_hide_icons();
		setTimeout(function() {
			  b3_process_fb_icon_lists();
			  b3_process_icons();
			  b3_show_icons();
		}, 100);
	});
	function b3_process_moudle_icons(hide){
		if(hide)
			b3_hide_icons();
		setTimeout(function() {
			b3_process_icons();
			if(hide)
				b3_show_icons();
		}, 100);
	}
	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
	function append_b3_icon_list(){
		b3_process_fb_icon_lists();
		$('.et-fb-font-icon-list').each(function(i, el){
			list_id = el.getAttribute('id');
			$this = $(el);
			$container = $this.parent().parent();

			if($container.find('.b3_filter_div').length <= 0){
				var output = '';
				output +='<div class="b3_filter_search_result">No search result found.</div><div class="b3_filter_div"><input data-icon-list="' + list_id + '" type="text" id="b3_custom_search"  placeholder="Search Icons....."  >';

				output += '<a href="#" data-icon-list="' + list_id + '" class="b3_filter b3_active"  data-b3filter="b3_all">All</a>';

				output += '<a href="#" data-icon-list="' + list_id + '" class="b3_filter" data-b3filter="b3_et">Elegant Themes</a>';
				if ( b3icons_options.divi_b3icon_line == 'on' && b3icons_options.divi_b3icon_line != '' ){
					output += '<a href="#" data-icon-list="' + list_id + '" class="b3_filter" data-b3filter="b3_line">Line Style Icons</a>';
				}
				if ( b3icons_options.divi_b3icon_fa == 'on' && b3icons_options.divi_b3icon_fa != '' ){
					output += '<a href="#" data-icon-list="' + list_id + '" class="b3_filter" data-b3filter="b3_fa">FontAwesome</a>';
				}
				if ( b3icons_options.divi_b3icon_mat == 'on' && b3icons_options.divi_b3icon_mat != '' ){
					output += '<a href="#" data-icon-list="' + list_id + '" class="b3_filter" data-b3filter="b3_mt">Material Design Icons</a>';
				}
				if ( b3icons_options.divi_b3holidayicon == 'on' && b3icons_options.divi_b3holidayicon != '' ){
					output += '<a href="#" data-icon-list="' + list_id + '" class="b3_filter" data-b3filter="b3_b3holidayicon">Holiday Icons</a>';
				}

				output += '</div>';
				$container.append(output);
			}
		})

	}
	function is_iic($element){ // is icon in content not in pseudo element (before|after)
		if($element.hasClass('b3-iic') || $element.html().indexOf("|") > -1 || $element.html().indexOf("~|") > -1)
			return true;
		return false;
	}
	function b3_process_element_icon($element, data_icon) {

		var symbol_data,
			iconContent
			icon_in_content = false;

		if($element.hasClass('b3-iic') || $element.html().indexOf("|") > -1 || $element.html().indexOf("~|") > -1)
			icon_in_content = true;
		if(typeof(data_icon) != 'undefined' ) {
			iconContent = data_icon;
		} else {
			if ( is_iic($element) )
				iconContent = $element.html();
			else
				iconContent = $element.attr('data-icon')
		}

		if(typeof (iconContent) == 'undefined') return;
		if(iconContent.indexOf("~|") >-1 )
			symbol_data = iconContent.split("~|");
		else if(iconContent.indexOf("|") >-1 )
			symbol_data = iconContent.split("|");
		else
			return

		$element.attr( 'data-icon', symbol_data[2] );

		var icon_filter = '';
		if( symbol_data[0] === 'et') {
			icon_filter = "b3_et b3_all";
		}else if( symbol_data[0] === 'b3lineicon') {
			icon_filter = "b3_line b3_all";
		}else if( symbol_data[0] === 'fab' ||  symbol_data[0] === 'fas' ||  symbol_data[0] === 'far'  ) {
			icon_filter = "b3_fa b3_all";
		}else if( symbol_data[0] === 'mt') {
			icon_filter = "b3_mt b3_all";
		}else if( symbol_data[0] === 'b3holidayicon') {
			icon_filter = "b3_b3holidayicon b3_all";
		}else{}

		$element.removeClass('b3_divi_et_icon_fd b3_divi_b3holidayicon_icon_fd b3_divi_fas_icon_fd b3_divi_far_icon_fd b3_divi_fab_icon_fd b3_divi_et_icon_fd b3_divi_mt_icon_fd b3_divi_b3lineicon_icon_fd');
		$element.addClass( 'b3_divi_' + symbol_data[0] + '_icon_fd '+ icon_filter );
		$element.addClass( 'b3_divi_icon_fd' );
		$element.attr('data-b3c',  'b3_divi_' + symbol_data[0].trim() + '_icon_fd');
		$element.attr('data-icon',  b3_decode_html_entries(symbol_data[2]));
		$element.attr('data-iconfamily', symbol_data[0]);

		if(icon_in_content){
			$element.html( symbol_data[2] );
			$element.addClass('b3_iic');
		}

	}

	function b3_decode_html_entries(str){
		var elem = document.createElement('textarea');
		elem.innerHTML = str;
		return elem.value;
	}
	function b3_process_fb_icon_lists(){
		$('.et-fb-font-icon-list, .b3_icon_lists').each(function(i, el){
			b3_process_fb_icon_list($(el));
		})
	}
	function b3_process_fb_icon_list(icon_list_ul) {
		var icon_list_children = icon_list_ul.children();
		var icon_data;
		var icon_set_name;
		for( var i = 0; i < icon_list_children.length; i++ ) {
		  var icon_item = icon_list_children[i];
		  if( $(icon_item).not('.b3_divi_icons_list') || $(icon_item).hasClass('active') ) {
			icon_data = $(icon_item).data('icon') + '';
				if (icon_data.indexOf('icon_quotations_alt2') > -1){
					 icon_data = icon_data.split("~|");
				}else{
					icon_data = icon_data.split("|");
				}

				if( icon_data.length > 1 ) {
				  icon_set_name = icon_data[0];
				  var icon_filter = '';
				  if( icon_data[0] === 'et') { icon_filter = "b3_et b3_all";
				  }else if( icon_data[0] === 'b3lineicon') { icon_filter = "b3_line b3_all";
				  }else if( icon_data[0] === 'fab' ||  icon_data[0] === 'fas' ||  icon_data[0] === 'far'  ) {icon_filter = "b3_fa b3_all";
				  }else if( icon_data[0] === 'mt') {icon_filter = "b3_mt b3_all";
				  }else if( icon_data[0] === 'b3holidayicon') {icon_filter = "b3_b3holidayicon b3_all";
				  }else{}
				  $(icon_item).attr({ "data-iconfamily" : icon_data[0], "data-iconname" : icon_data[1], "title" : icon_data[1],"data-icon" : icon_data[2] });
				  if (  icon_filter != '' ){$(icon_item).addClass( 'b3_divi_icons_list b3_divi_' + icon_data[0] + '_icon_fd '+icon_filter );}
				} else {
				  $(icon_item).attr( "data-iconfamily", 'et' );
				}
		  }
		}
	}
	function b3_hide_icons() {
		if( is_et_fb_pro() && $('iframe#' + fb_frame_selector).length ) {
			var builder_frame = $('iframe#' + fb_frame_selector);
			$( all_divi_module_list, builder_frame.contents() ).removeClass('show_icon');
			$( all_divi_module_list, builder_frame.contents() ).addClass('hide_icon');
		} else {
			$( all_divi_module_list ).removeClass('show_icon');
			  $( all_divi_module_list ).addClass('hide_icon');
		}
	}
	function b3_show_icons() {
		if( is_et_fb_pro() && $('iframe#' + fb_frame_selector).length ) {
		  var builder_frame = $('iframe#' + fb_frame_selector);
		  $( all_divi_module_list, builder_frame.contents() ).removeClass('hide_icon');
		  $( all_divi_module_list, builder_frame.contents() ).addClass('show_icon');
		} else {
		  $( all_divi_module_list ).removeClass('hide_icon');
		  $( all_divi_module_list ).addClass('show_icon');
		}
	}
	/* 	Divi Machine Compataplity */
	function b3_process_dmach_icons(){
		document.querySelectorAll('.dmach-icon, .et_overlay').forEach(function(el, i){
			var style = window.getComputedStyle(el, '::before')
			var elem = document.createElement('textarea');
			elem.innerHTML = style.content;
			var decoded = elem.value;
			decoded = decoded.replace('\\', '')
			decoded = decoded.replace(' ', '')
			decoded = decoded.replace('"', '')
			decoded = decoded.replace('"', '')
			decoded = decoded.replace('ú', 'fa')
			decoded = decoded.replace('³', 'b3')
			b3_process_element_icon($(el), decoded)
		})
	}
	function b3_process_icons() {
		b3_process_dmach_icons();
		$( all_divi_module_list ).each(function(i, module){
				b3_process_element_icon($(module))
		});

	}
 // Filter Buttons
	$( document.body ).on('click','.b3_filter_div a', function(e){
		e.preventDefault();

		var context = document.getElementById(e.target.getAttribute('data-icon-list')),
				parent_context = null

		if(context === null)
			context, parent_context = document.querySelector('body')
		else
			parent_context = context.parentNode.parentNode	;




		$('.b3_icon_lists').css("overflow-y", "scroll");
		$('#b3_custom_search', parent_context).val('');

		$('.b3_filter_search_result', parent_context).hide();
		var fbBody = $('body.et-bfb');
		if ($('body.et-bfb').length || $('body.et-db').length) {
				var b3custom_icons = $('.b3_divi_icons_list', context);
		}else{
				var b3custom_icons = $('.b3customicon', context);
		}
		$( '.b3_filter_div a', parent_context ).removeClass('b3_active');
		$( this ).addClass('b3_active');
		var current_b3custom_icon_family = $( this ).data('b3filter');
		b3custom_icons.hide().filter('.'+ current_b3custom_icon_family ).show();
		return false;
	});

	$( document ).on( 'keyup', '#b3_custom_search', function() {
		var fbBody = $('body.et-bfb');
		if ($('body.et-bfb').length || $('body.et-db').length) {
				$('.et-fb-font-icon-list').css("overflow-y","scroll");
			$('.b3_filter_search_result').hide();
			var searchStr = $(this).val();
			var b3filter_current = $('.b3_filter.b3_active').data("b3filter");
			$('.b3_divi_icons_list').each(function() {
					var str = $(this).attr("data-iconname");
					if(str.indexOf(searchStr) > -1 ) {
						if ( $(this).hasClass(b3filter_current) ) { $(this).show();  }
					} else {
						$(this).hide();
					}
			});
			if ( $('.b3_divi_icons_list:not([style*="display: none"])').length == 0 ){
				$('.et-fb-font-icon-list').css("overflow-y","hidden");
				$('.b3_filter_search_result').show();
			}

		}else{
			$('.b3_icon_lists').css("overflow-y","scroll");
			$('.b3_filter_search_result').hide();
			var searchStr = $(this).val();
			var b3filter_current = $('.b3_filter.b3_active').data("b3filter");
			$('.b3customicon').each(function() {
					var str = $(this).attr("data-iconname");
						if(str.indexOf(searchStr) > -1 ) {
							if ( $(this).hasClass(b3filter_current) ) { $(this).show();  }
						} else {
							$(this).hide();
						}
			});
			if ( $('.b3customicon:not([style*="display: none"])').length == 0 ){
				$('.b3_icon_lists').css("overflow-y","hidden");
				$('.b3_filter_search_result').show();
			}
		}
	});
	$(document).on('click', all_divi_module_list_toggles, function(e) {
		setTimeout(function(){
			b3_process_fb_icon_lists();
		}, 100);
	});




	$( document).on('mousedown','.et-fb-font-icon-list li', function(event){
		var iframeName = false;
		if($('iframe#' + fb_frame_selector).length)
			iframeName = fb_frame_selector

		if($('iframe#et-bfb-app-frame').length)
			iframeName = 'et-bfb-app-frame';

		if( is_et_fb_pro() && iframeName ) {
			var builder_frame = $('iframe#' + iframeName);
			$('.et_fb_editing_enabled', builder_frame.contents()).find(all_divi_module_list).removeClass('show_icon');
			$('.et_fb_editing_enabled', builder_frame.contents()).find(all_divi_module_list).addClass('hide_icon');
		}
	});

	$( document).on('mouseup','.et-fb-font-icon-list li', function(event){
		var iframeName = false;
		if($('iframe#' + fb_frame_selector).length)
			iframeName = fb_frame_selector

		if($('iframe#et-bfb-app-frame').length)
			iframeName = 'et-bfb-app-frame';

			window.setTimeout(function(){
				if( is_et_fb_pro() && iframeName ) {
					var builder_frame = $('iframe#' + iframeName);

					$('.et_fb_editing_enabled', builder_frame.contents()).find(all_divi_module_list).each(function(i, module){
						b3_process_element_icon($(module))
					  });
					$( all_divi_module_list, builder_frame.contents() ).removeClass('hide_icon');
					$( all_divi_module_list, builder_frame.contents() ).addClass('show_icon');
				}
			},0);

	});


	})( jQuery );
