
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
    });
  



$(document).ready(function() {


    // Datepicker
    $('.datepicker')[0] && $('.datepicker').each(function() {
        $('.datepicker').datepicker({
            disableTouchKeyboard: true,
            autoclose: false
        });
    });

    $('input.form-control, select.form-control').blur(function(){
        //alert('hi');
        tmpval = $(this).val();
        if(tmpval == '') {
            $(this).addClass('empty');

        } else {
            $(this).removeClass('empty');
        }
    });

    $('input.pass-info').focusin(function() { 
        $('.leftinfo-box').addClass('leftinfo-box-show');
        $('.comp-info').css('display','none');
    });
    $('input.pass-info').focusout(function() { 
        $('.leftinfo-box').removeClass('leftinfo-box-show');
        $('.comp-info').css('display','block');
    });

    /* button edit save state*/
    $('.button-wrap .btn-edit').on('click',function(){ 
        $(this).siblings('.btn-save, .btn-delete').removeAttr('disabled');   //find it's pair textarea
        $(this).attr('disabled', 'true');
    });
    $('.button-wrap .btn-save').on('click',function(){ 
        $(this).siblings('.btn-edit').removeAttr('disabled');   //find it's pair textarea
        $(this).attr('disabled', 'true');
        $(this).siblings('.btn-delete').attr('disabled', 'true');
    });


    /*Show Address Box*/
    $('.add-address').on('click', function(){
            $('.addressBox').css('display', 'block');
            $('.address-block').css('display', 'none');
        });
        $('.find-address').on('click', function(){
            //$('.addressBox').css('display', 'none');
            $('.auto-address').css('display', 'block');
        });



    /*--/ Navbar Menu Reduce /--*/
	$(window).trigger('scroll');
	$(window).on('scroll', function () {
		var pixels = 50; 
		var top = 1200;
		if ($(window).scrollTop() > pixels) {
			$('.navbar-expand-md').addClass('navbar-reduce');
			$('.navbar-expand-md').removeClass('navbar-trans');
		} else {
			$('.navbar-expand-md').addClass('navbar-trans');
			$('.navbar-expand-md').removeClass('navbar-reduce');
		}
		if ($(window).scrollTop() > top) {
			$('.scrolltop-mf').fadeIn(1000, "easeInOutExpo");
		} else {
			$('.scrolltop-mf').fadeOut(1000, "easeInOutExpo");
		}
	});

 });
