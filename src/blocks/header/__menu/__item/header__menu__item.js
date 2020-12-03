$(function () {
    console.log($('.header__menu .header__menu__item:first-child'))
    $('.header__menu .header__menu__item:first-child').addClass('header__menu__item_active');

    $(".header__menu a").on('click', function () {
        $(".header__menu a").removeClass("header__menu__item_active")
        $(this).addClass("header__menu__item_active")
        return false;
    })
})