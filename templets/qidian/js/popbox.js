;(function() {
  var tmpl = [
	'<div class="global-popbox popbox-{{=it.type}}">',
	  '<div class="overlay"></div>',
	  '<div class="popbox-dialog">',
		  '{{? it.title}}',
		  '<h3 class="title">{{= it.title}}</h3>',
		  '{{?}}',
		  '{{? it.hasClose}}',
		  '<a href="javascript:" class="popbox-close">×</a>',
		  '{{?}}',
		  '<div class="popbox-body">{{= it.content}}</div>',
		  '<div class="popbox-ft">',
			'{{~ it.btns:item}}',
			  '<a href="javascript:" class="button {{=item.className}}">{{=item.text}}</a>',
			'{{~}}',
		  '</div>',
	  '</div>',
	'</div>'
  ].join('');

  var render = doT.template(tmpl);

  var alert = function(title, content, callbck) {
	var options = {
	  type: 'alert',
	  title: title,
	  content: content,
	  hasClose: false,
	  btns: [
		{
		  className: '',
		  text: '确定',
		  value: ''
		}
	  ]
	};
	if(typeof title === 'object') {
	  options = $.extend(options, title);
	  callbck = options.btnFn;
	}

	var $popbox = $(render(options)).appendTo($('body'));
	$popbox.find('.popbox-ft .button').on('click', function() {
	  if(callbck) callbck();
	  $popbox.remove();
	})

	if(options.hasClose) {
		$popbox.find('.popbox-close').on('click', function() {
			if(typeof options.close === 'function') options.close();
			$popbox.remove();
		})
	}
	return $popbox;
  }

  var confirm = function(title, content, callbck) {
	var options = {
	  type: 'confirm',
	  title: title,
	  content: content,
	  hasClose: false,
	  btns: [
		{
		  className: 'button-default',
		  text: '取消',
		  value: false
		},
		{
		  className: 'button-primary',
		  text: '确定',
		  value: true
		}
	  ]
	}

	if(typeof title === 'object') {
	  options = $.extend(options, title);
	  callbck = options.btnFn;
	}

	var $popbox = $(render(options)).appendTo($('body'));
	$popbox.find('.popbox-ft .button').on('click', function() {
	  if(callbck) {
		callbck(options.btns[$(this).index()].value);
	  }
	  $popbox.remove();
	})

	if(options.hasClose) {
		$popbox.find('.popbox-close').on('click', function() {
			if(typeof options.close === 'function') options.close();
			$popbox.remove();
		})
	}
	return $popbox;
  }

  var popbox = {
	alert: alert,
	confirm: confirm
  }
  window.popbox = popbox;
})($);