window.addEvent('domready', function() {

	feToolbar = new Element('div',
	{
		'id' : 'fee_toolbar'
	});

	feToolbar.inject($(document.body), 'top');

	feToolbar.setState = function(checked, flash)
	{
		this.setStyle('background-image', 'url(system/modules/fe_editor/html/images/application'+(checked==1?'_edit.png':'.png')+')');
		this.store('checked', checked);

		Cookie.write('fee_checked', checked);

		if (checked==1)
		{
			$$('.fe_editor').addClass('fee_editable');
			
			if (flash)
			{
				$$('.fe_editor').addClass('fee_flash');
				
				setTimeout(function()
				{
					$$('.fe_editor').removeClass('fee_flash');
				}, 250);
			}
		}
		else
		{
			$$('.fe_editor').removeClass('fee_editable');
		}
	};

	state = Cookie.read('fee_checked');
	feToolbar.setState((state=='null'?0:state), false);

	feToolbar.addEvent('click', function(e)
	{
		this.setState((this.retrieve('checked')==1?0:1), true);
	});


	window.addEvent('mb_close', function(e) {
		//window.location.reload();
	});

});