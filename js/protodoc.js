(function ($)
{
    var $document = $(document);

    function addEvent(eventName, selector, cb)
    {
        $document.on(eventName, selector, cb);
    }

    addEvent('click', '.send-btn', function (e)
    {
        e.preventDefault();

        var $form = $(this).closest('form');

        var method = $form.attr('method'),
            url    = $form.attr('action'),
            data   = {};

        $.each($form.serializeArray(), function (i, field)
        {
            data[field.name] = field.value;
        });

        $.ajax({
            url   : url,
            method: method,
            data  : data
        });
    });

    addEvent('click', '.test-btn', function (e)
    {
        var $card = $(this).closest('.card');

        var $form = $card.find('form').first();

        $form.slideToggle();
    });

    addEvent('click', '.top-btn', function ()
    {
        $('body').animate({scrollTop: 0}, 500);
    });

})(jQuery);