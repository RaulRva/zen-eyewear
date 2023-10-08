(function (a) {
    a("#collection-sidebar") &&
        window.use_color_swatch &&
        (a(".swatch :radio").change(function () {
            var b2 = a(this).closest(".swatch").attr("data-option-index"),
                c = a(this).val();
            a(this).closest("form").find(".single-option-selector").eq(b2).val(c).trigger("change");
        }),
        (Shopify.optionsMap = {}),
        (Shopify.updateOptionsInSelector = function (b2) {
            switch (b2) {
                case 0:
                    var c = "root",
                        d = a(".single-option-selector:eq(0)");
                    break;
                case 1:
                    var c = a(".single-option-selector:eq(0)").val(),
                        d = a(".single-option-selector:eq(1)");
                    break;
                case 2:
                    var c = a(".single-option-selector:eq(0)").val();
                    c += " / " + a(".single-option-selector:eq(1)").val();
                    var d = a(".single-option-selector:eq(2)");
            }
            var e = d.val();
            d.empty();
            for (var f = Shopify.optionsMap[c], g = 0; g < f.length; g++) {
                var h = f[g],
                    i2 = a("<option></option>").val(h).html(h);
                d.append(i2);
            }
            a('.swatch[data-option-index="' + b2 + '"] .swatch-element').each(function () {
                a.inArray(a(this).attr("data-value"), f) !== -1
                    ? a(this).removeClass("soldout").show().find(":radio").removeAttr("disabled", "disabled").removeAttr("checked")
                    : a(this).addClass("soldout").hide().find(":radio").removeAttr("checked").attr("disabled", "disabled");
            }),
                a.inArray(e, f) !== -1 && d.val(e),
                d.trigger("change");
        }),
        (Shopify.linkOptionSelectors = function (b2) {
            for (var c = 0; c < b2.variants.length; c++) {
                var d = b2.variants[c];
                if (d.available) {
                    if (((Shopify.optionsMap.root = Shopify.optionsMap.root || []), Shopify.optionsMap.root.push(d.option1), (Shopify.optionsMap.root = Shopify.uniq(Shopify.optionsMap.root)), b2.options.length > 1)) {
                        var e = d.option1;
                        (Shopify.optionsMap[e] = Shopify.optionsMap[e] || []), Shopify.optionsMap[e].push(d.option2), (Shopify.optionsMap[e] = Shopify.uniq(Shopify.optionsMap[e]));
                    }
                    if (b2.options.length === 3) {
                        var e = d.option1 + " / " + d.option2;
                        (Shopify.optionsMap[e] = Shopify.optionsMap[e] || []), Shopify.optionsMap[e].push(d.option3), (Shopify.optionsMap[e] = Shopify.uniq(Shopify.optionsMap[e]));
                    }
                }
            }
            Shopify.updateOptionsInSelector(0),
                b2.options.length > 1 && Shopify.updateOptionsInSelector(1),
                b2.options.length === 3 && Shopify.updateOptionsInSelector(2),
                a(".single-option-selector:eq(0)").change(function () {
                    return Shopify.updateOptionsInSelector(1), b2.options.length === 3 && Shopify.updateOptionsInSelector(2), !0;
                }),
                a(".single-option-selector:eq(1)").change(function () {
                    return b2.options.length === 3 && Shopify.updateOptionsInSelector(2), !0;
                });
        })),
        a(document).ready(function () {
            b.go();
        }),
        a(window).resize(function () {
            b.goResizeImage();
        });
    var b = {
        atTimeout: null,
        isSidebarAjaxClick: !1,
        go: function () {
            this.goResizeImage(),
                this.goQuickView(),
                this.goSidebar(),
                this.goCloudzoom(),
                this.goScrollTop(),
                this.goDropDownCart(),
                this.translateBlock(".main-content"),
                this.goAddToCart(),
                this.goBox(),
                this.goProductAddToCart(),
                this.goWishlist(),
                this.goProductWishlist(),
                this.goRemoveWishlist(),
                this.goColorSwatchGridInit(),
                this.goInfiniteScrolling();
        },
        goInfiniteScrolling: function () {
            a(".infinite-scrolling").length > 0 &&
                a(".infinite-scrolling a").click(function (c) {
                    c.preventDefault(), a(this).hasClass("disabled") || b.doInfiniteScrolling();
                });
        },
        doInfiniteScrolling: function () {
            var c = a(".main_container .products-grid");
            if ((c.length || (c = a(".main_container .product-list")), c)) {
                var d = a(".infinite-scrolling a").first();
                a.ajax({
                    type: "GET",
                    url: d.attr("href"),
                    beforeSend: function () {
                        b.showLoading(), a(".loading-modal").show();
                    },
                    success: function (e) {
                        b.hideLoading();
                        var f = a(e).find(".main_container .products-grid");
                        if (
                            (f.length || (f = a(e).find(".main_container .product-list-item")),
                            f.length &&
                                (f.hasClass("products-grid") &&
                                    window.product_image_resize &&
                                    f.children().find("img").fakecrop({ fill: window.images_size.is_crop, widthSelector: ".products-grid .grid-item .product-image", ratioWrapper: window.images_size }),
                                c.append(f.children()),
                                b.goQuickView(),
                                b.goAddToCart(),
                                b.goWishlist(),
                                a(e).find(".infinite-scrolling").length > 0 ? d.attr("href", a(e).find(".infinite-scrolling a").attr("href")) : (d.hide(), d.next().show()),
                                a(".spr-badge").length > 0))
                        )
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    },
                    error: function (c2, d2) {
                        b.hideLoading(), a(".loading-modal").hide(), a(".ajax-error-message").text(a.parseJSON(c2.responseText).description), b.showModal(".ajax-error-modal");
                    },
                    dataType: "html",
                });
            }
        },
        goColorSwatchGridInit: function () {
            a(".color-swatch-item li label").on("click", function (b2) {
                b2.preventDefault();
                var newImage = jQuery(this).parent().find(".hidden a").attr("data-image");
                jQuery(this).parent().find("input").prop("checked", !0);
                var c = a(this).parents(".product-inner").find(".grid-image");
                c.find("img.feature-images").attr("src", newImage);
            }),
                a(".color-swatch-item li a").on("click", function (b2) {
                    $(".color-swatch-item label").removeClass("active"), $(this).parent().addClass("active");
                });
        },
        sidebarMapTagEvents: function () {
            a(".filter-tag a, .filter-tag label").click(function (c) {
                var d = [];
                if ((Shopify.queryParams.constraint && (d = Shopify.queryParams.constraint.split("+")), !window.enable_sidebar_multiple_choice && !a(this).prev().is(":checked"))) {
                    var e = a(this).parents(".filter-tag").find("input:checked");
                    if (e.length > 0) {
                        var f = e.val();
                        if (f) {
                            var g = d.indexOf(f);
                            g >= 0 && d.splice(g, 1);
                        }
                    }
                }
                var f = a(this).prev().val();
                if (f) {
                    var g = d.indexOf(f);
                    g >= 0 ? d.splice(g, 1) : d.push(f);
                }
                d.length ? (Shopify.queryParams.constraint = d.join("+")) : delete Shopify.queryParams.constraint, b.sidebarAjaxClick(), c.preventDefault();
            });
        },
        sidebarMapEvents: function () {
            b.sidebarMapTagEvents();
        },
        checkItemsInDropdownCart: function () {
            a("#dropdown-cart .cart-list").children().length > 0
                ? (a("#dropdown-cart .cart-empty").hide(), a("#dropdown-cart .mini_cart_header").show())
                : (a("#dropdown-cart .mini_cart_header").hide(), a("#dropdown-cart .cart-empty").show());
        },
        goDropDownCart: function () {
            b.checkItemsInDropdownCart(),
                a("#dropdown-cart .cart-empty a").click(function () {
                    a("#dropdown-cart").slideUp("fast");
                }),
                a("#dropdown-cart .btn-remove").click(function (c) {
                    c.preventDefault();
                    var d = a(this).parents(".item").attr("id");
                    (d = d.match(/\d+/g)),
                        Shopify.removeItem(d, function (a2) {
                            b.doUpdateDropdownCart(a2);
                        });
                });
        },
        closeDropdownCart: function () {
            a("#dropdown-cart").is(":visible") && a("#dropdown-cart").slideUp("fast");
        },
        sidebarMapTagEvents: function () {
            a(".filter-tag a, .filter-tag label").click(function (c) {
                var d = [];
                if ((Shopify.queryParams.constraint && (d = Shopify.queryParams.constraint.split("+")), !window.enable_sidebar_multiple_choice && !a(this).prev().is(":checked"))) {
                    var e = a(this).parents(".filter-tag").find("input:checked");
                    if (e.length > 0) {
                        var f = e.val();
                        if (f) {
                            var g = r.indexOf(f);
                            g >= 0 && r.splice(g, 1);
                        }
                    }
                }
                var f = a(this).prev().val();
                if (f) {
                    var g = d.indexOf(f);
                    g >= 0 ? d.splice(g, 1) : d.push(f);
                }
                d.length ? (Shopify.queryParams.constraint = d.join("+")) : delete Shopify.queryParams.constraint, b.sidebarAjaxClick(), c.preventDefault();
            });
        },
        sidebarMapCategories: function () {},
        sidebarMapView: function () {},
        sidebarMapShow: function () {
            a(".filter-show a").click(function (c) {
                if (!a(this).parent().hasClass("active")) {
                    var d = a(this).attr("href"),
                        e = a(".view-mode a.active").attr("href");
                    e == "list" ? (Shopify.queryParams.view = "list" + d) : (Shopify.queryParams.view = d),
                        b.sidebarAjaxClick(),
                        a(".filter-show > button span").text(d),
                        a(".filter-show li.active").removeClass("active"),
                        a(this).parent().addClass("active");
                }
                c.preventDefault();
            });
        },
        sidebarInitToggle: function () {
            a(".filter-tag").length > 0 &&
                a(".filter-tag .widget-title span").click(function () {
                    a(this).parents(".widget-title"), b.hasClass("click") ? b.removeClass("click") : b.addClass("click"), a(this).parents(".filter-tag").find(".widget-content").slideToggle();
                });
        },
        sidebarMapSorting: function (c) {
            a(".browse-tags a").click(function (c2) {
                if (!a(this).parent().hasClass("active")) {
                    (Shopify.queryParams.sort_by = a(this).attr("href")), b.sidebarAjaxClick();
                    var d = a(this).text();
                    a(".browse-tags > button span").text(d), a(".browse-tags li.active").removeClass("active"), a(this).parent().addClass("active");
                }
                c2.preventDefault();
            });
        },
        sidebarMapPaging: function () {
            a(".pagination-page a").click(function (a2) {});
        },
        sidebarMapClearAll: function () {
            a(".refined-widgets a.clear-all").click(function (a2) {
                delete Shopify.queryParams.constraint, delete Shopify.queryParams.q, b.sidebarAjaxClick(), a2.preventDefault();
            });
        },
        sidebarMapClear: function () {
            a(".filter-tag").each(function () {
                var c = a(this);
                c.find("input:checked").length > 0 &&
                    c
                        .find(".clear")
                        .show()
                        .click(function (d) {
                            var e = [];
                            Shopify.queryParams.constraint && (e = Shopify.queryParams.constraint.split("+")),
                                c.find("input:checked").each(function () {
                                    var c2 = a(this),
                                        d2 = b.val();
                                    if (d2) {
                                        var c2 = e.indexOf(d2);
                                        r >= 0 && e.splice(c2, 1);
                                    }
                                }),
                                e.length ? (Shopify.queryParams.constraint = e.join("+")) : delete Shopify.queryParams.constraint,
                                b.sidebarAjaxClick(),
                                d.preventDefault();
                        });
            });
        },
        sidebarMapEvents: function () {
            b.sidebarMapTagEvents(), b.sidebarMapCategories(), b.sidebarMapView(), b.sidebarMapShow(), b.sidebarMapSorting(), b.goInfiniteScrolling();
        },
        reActivateSidebar: function () {
            a(".filter-custom .active, .widget-category .active").removeClass("active"), a(".filter-tag input:checked").attr("checked", !1);
            var c = location.pathname.match(/\/collections\/(.*)(\?)?/);
            if ((c && c[1] && a(".widget-category a[href='" + c[0] + "']").addClass("active"), Shopify.queryParams.view)) {
                a(".view-mode .active").removeClass("active");
                var d = Shopify.queryParams.view;
                d.indexOf("list") >= 0 ? (d(".view-mode .list").addClass("active"), (d = d.replace("list", ""))) : a(".view-mode .grid").addClass("active"),
                    a(".filter-show > button span").text(d),
                    a(".filter-show li.active").removeClass("active"),
                    a(".filter-show a[href='" + d + "']")
                        .parent()
                        .addClass("active");
            }
            b.goSortby();
        },
        goSortby: function () {
            if (Shopify.queryParams.sort_by) {
                var b2 = Shopify.queryParams.sort_by,
                    c = a(".browse-tags a[href='" + b2 + "']").text();
                a(".browse-tags > button span").text(c),
                    a(".browse-tags li.active").removeClass("active"),
                    a(".browse-tags a[href='" + b2 + "']")
                        .parent()
                        .addClass("active");
            }
        },
        sidebarMapData: function (b2) {
            var c = a(".col-main .products-grids");
            c.length == 0 && (c = a(".col-main .product-list"));
            var d = a(b2).find(".col-main .products-grids");
            d.length == 0 && (d = a(b2).find(".col-main .product-list"));
            var e = a(".col-main .products-grid");
            e.length == 0 && (e = a(".col-main .product-list"));
            var f = a(b2).find(".col-main .products-grid");
            f.length == 0 && (f = a(b2).find(".col-main .product-list")),
                f.length > 0 &&
                    f.hasClass("products-grid") &&
                    window.product_image_resize &&
                    f.find("img").fakecrop({ fill: window.images_size.is_crop, widthSelector: ".products-grid .grid-item .product-image", ratioWrapper: window.images_size }),
                e.replaceWith(f),
                c.replaceWith(d),
                a(".padding").length > 0 ? a(".padding").replaceWith(a(b2).find(".padding")) : a(".main-content .col-main").append(a(b2).find(".padding"));
            var g = a(".page-header"),
                h = a(b2).find(".page-header");
            g.find("h2").text() != h.find("h2").text() &&
                (g.find("h2").replaceWith(h.find("h2")), g.find(".rte").length ? (h.find(".rte").length ? g.find(".rte").replaceWith(h.find(".rte")) : g.find(".rte").hide()) : h.find(".rte").length && g.find("h2").after(h.find(".rte"))),
                a(".refined-widgets").replaceWith(a(b2).find(".refined-widgets")),
                a(".filter-block").replaceWith(a(b2).find(".filter-block"));
        },
        sidebarCreateUrl: function (b2) {
            var c = a.param(Shopify.queryParams).replace(/%2B/g, "+");
            return b2 ? (c != "" ? b2 + "?" + c : b2) : location.pathname + "?" + c;
        },
        sidebarAjaxClick: function (a2) {
            delete Shopify.queryParams.page;
            var c = b.sidebarCreateUrl(a2);
            (b.isSidebarAjaxClick = !0), History.pushState({ param: Shopify.queryParams }, c, c), b.sidebarGetContent(c);
        },
        get_isotope: function () {},
        sidebarGetContent: function (c) {
            a.ajax({
                type: "get",
                url: c,
                beforeSend: function () {
                    b.showLoading();
                },
                success: function (a2) {
                    b.sidebarMapData(a2),
                        b.sidebarMapPaging(),
                        b.sidebarMapTagEvents(),
                        b.sidebarInitToggle(),
                        b.sidebarMapClear(),
                        b.sidebarMapClearAll(),
                        b.hideLoading(),
                        b.goAddToCart(),
                        b.goWishlist(),
                        b.goColorSwatchGridInit(),
                        b.get_isotope(),
                        b.goQuickView(),
                        b.goInfiniteScrolling();
                },
                error: function (c2, d) {
                    b.hideLoading(), a(".loading-modal").hide(), a(".ajax-error-message").text(a.parseJSON(c2.responseText).description), b.showModal(".ajax-error-modal");
                },
            });
        },
        sidebarParams: function () {
            if (((Shopify.queryParams = {}), location.search.length))
                for (var b2, c = 0, d = location.search.substr(1).split("&"); c < d.length; c++) (b2 = d[c].split("=")), a.length > 1 && (Shopify.queryParams[decodeURIComponent(b2[0])] = decodeURIComponent(b2[1]));
        },
        goSidebar: function () {
            a("#collection-sidebar").length > 0 && (b.sidebarParams(), b.goSortby(), b.sidebarMapEvents(), b.sidebarMapPaging(), b.sidebarInitToggle(), b.sidebarMapClear(), b.sidebarMapClearAll(), b.goQuickView(), b.goInfiniteScrolling());
        },
        goWishlist: function () {
            a(".grid-item button.wishlist").click(function (c) {
                c.preventDefault();
                var d = a(this).parent();
                d.parents(".grid-item"),
                    a.ajax({
                        type: "POST",
                        url: "/contact",
                        data: d.serialize(),
                        beforeSend: function () {
                            b.showLoading();
                        },
                        success: function (c2) {
                            b.hideLoading(),
                                d.html('<a class="wishlist harman_btn3" href="/pages/wish-list" title="Go to wishlist"><i class="fa fa-check"></i></a>'),
                                a(".ajax-success-cbox").find(".show-wishlist").show(),
                                a(".ajax-success-cbox").find(".show-cart").hide(),
                                b.showBox(".ajax-success-cbox");
                        },
                        error: function (c2, d2) {
                            b.hideLoading(), a(".loading").hide(), a(".ajax-error-message").text(a.parseJSON(c2.responseText).description), b.showBox(".ajax-error-cbox");
                        },
                    });
            });
        },
        goProductWishlist: function () {
            a(".product button.wishlist").click(function (c) {
                c.preventDefault();
                var d = a(this).parent();
                d.parents(".grid-item"),
                    a.ajax({
                        type: "POST",
                        url: "/contact",
                        data: d.serialize(),
                        beforeSend: function () {
                            b.showLoading();
                        },
                        success: function (c2) {
                            b.hideLoading(),
                                d.html('<a class="wishlist harman_btn3" href="/pages/wish-list" title="Go to wishlist"><i class="fa fa-check"></i></a>'),
                                a(".ajax-success-cbox").find(".show-wishlist").show(),
                                a(".ajax-success-cbox").find(".show-cart").hide(),
                                b.showBox(".ajax-success-cbox");
                        },
                        error: function (c2, d2) {
                            b.hideLoading(), a(".loading").hide(), a(".ajax-error-message").text(a.parseJSON(c2.responseText).description), b.showBox(".ajax-error-cbox");
                        },
                    });
            });
        },
        goRemoveWishlist: function () {
            a(".btn-remove-wishlist").click(function (c) {
                var d = a(this).parents("tr"),
                    e = d.find(".tag-id").val(),
                    f = jQuery("#remove-wishlist-form");
                f.find("input[name='contact[tags]']").val("x" + e),
                    a.ajax({
                        type: "POST",
                        url: "/contact",
                        data: f.serialize(),
                        beforeSend: function () {
                            b.showLoading();
                        },
                        success: function (a2) {
                            b.hideLoading(), d.fadeOut(1e3);
                        },
                        error: function (c2, d2) {
                            b.hideLoading(), a(".loading-modal").hide(), a(".ajax-error-message").text(a.parseJSON(c2.responseText).description), b.showModal(".ajax-error-cbox");
                        },
                    });
            });
        },
        goResizeImage: function () {
            window.product_image_resize && a(".products-grid .product-image img").fakecrop({ fill: window.images_size.is_crop, widthSelector: ".products-grid .grid-item .product-image", ratioWrapper: window.images_size });
        },
        showBox: function (c) {
            a(c).fadeIn(500),
                (b.atTimeout = setTimeout(function () {
                    a(c).fadeOut(500);
                }, 5e3));
        },
        goBox: function () {
            a(".continue-shopping").click(function () {
                clearTimeout(b.atTimeout), a(".ajax-success-cbox").fadeOut(500);
            }),
                a(".close-cbox").click(function () {
                    clearTimeout(b.atTimeout), a(".ajax-success-cbox").fadeOut(500);
                });
        },
        goCloudzoom: function () {
            a("#product-featured-image").length > 0 &&
                (a("#product-featured-image").elevateZoom({
                    gallery: "gts_product_thumb",
                    zoomType: "inner",
                    onImageSwapComplete: function () {
                        a(".gallery-images div").hide();
                    },
                    loadingIcon: window.loading_url,
                }),
                a("#product-featured-image").bind("click", function (b2) {
                    var c = a("#product-featured-image").data("elevateZoom");
                    return a.fancybox(c.getGalleryList()), !1;
                }));
        },
        goScrollTop: function () {
            a("#back-top").click(function () {
                return a("body,html").animate({ scrollTop: 0 }, 400), !1;
            });
        },
        goProductAddToCart: function () {
            a("#product-add-to-cart").length > 0 &&
                a("#product-add-to-cart").click(function (c) {
                    if ((c.preventDefault(), a(this).attr("disabled") != "disabled"))
                        if (window.ajax_cart) {
                            var d = a("#add-to-cart-form select[name=id]").val();
                            d || (d = a("#add-to-cart-form input[name=id]").val());
                            var e = a("#add-to-cart-form input[name=quantity]").val();
                            e || (e = 1);
                            var f = a("#product-featured-image").attr("src");
                            b.doAjaxAddToCart(d, e, f);
                        } else a(this).closest("form").submit();
                    return !1;
                });
        },
        goAddToCart: function () {
            a(".ajax_addtocart").length > 0 &&
                a(".ajax_addtocart").click(function (c) {
                    if ((c.preventDefault(), a(this).attr("disabled") != "disabled")) {
                        var d = a(this).parents(".product-item"),
                            e = a(d).attr("id");
                        if (((e = e.match(/\d+/g)), window.ajax_cart)) {
                            var f = a("#product-actions-" + e + " select[name=id]").val();
                            f || (f = a("#product-actions-" + e + " input[name=id]").val());
                            var g = a("#product-actions-" + e + " input[name=quantity]").val();
                            g || (g = 1);
                            var h = a(d).find(".title-products").text();
                            b.doAjaxAddToCart(f, g, h);
                        } else a("#product-actions-" + e).submit();
                    }
                    return !1;
                });
        },
        showLoading: function () {
            a(".loading").show();
        },
        hideLoading: function () {
            a(".loading").hide();
        },
        doAjaxAddToCart: function (c, d, e, f) {
            a.ajax({
                type: "post",
                url: "/cart/add.js",
                data: "quantity=" + d + "&id=" + c,
                dataType: "json",
                beforeSend: function () {
                    b.showLoading();
                },
                success: function (c2) {
                    b.hideLoading(),
                        a(".ajax-success-cbox").find(".ajax-product-title").html(b.translateText(e)),
                        a(".ajax-success-cbox").find(".show-wishlist").hide(),
                        jQuery("#dropdown-cart").addClass("active"),
                        jQuery(".wrapper-container").addClass("show-cart"),
                        b.updateDropdownCart();
                },
                error: function (c2, d2) {
                    b.hideLoading(), a(".ajax-error-message").text(a.parseJSON(c2.responseText).description), b.showBox(".ajax-error-cbox");
                },
            });
        },
        loadQuickViewSlider: function (a2, c) {
            var d = Shopify.resizeImage(a2.featured_image, "grande");
            if (
                (c
                    .find(".quickview-featured-image")
                    .append(
                        '<a href="' +
                            a2.url +
                            '"><img src="' +
                            d +
                            '" title="' +
                            a2.title +
                            '"/><div style="height: 100%; width: 100%; top:0; left:0 z-index: 2000; position: absolute; display: none; background: url(' +
                            window.loading_url +
                            ') 50% 50% no-repeat;"></div></a>'
                    ),
                a2.images.length > 0)
            ) {
                var e = c.find(".more-view ul");
                for (i in a2.images) {
                    var f = Shopify.resizeImage(a2.images[i], "grande"),
                        g = Shopify.resizeImage(a2.images[i], "compact"),
                        h = '<li><a href="javascript:void(0)" data-image="' + f + '"><img src="' + g + '"  /></a></li>';
                    e.append(h);
                }
                e.find("a").click(function () {
                    var a3 = c.find(".quickview-featured-image img"),
                        b2 = c.find(".quickview-featured-image div");
                    a3.attr("src") != jQuery(this).attr("data-image") &&
                        (a3.attr("src", jQuery(this).attr("data-image")),
                        b2.show(),
                        a3.load(function (a4) {
                            b2.hide(), jQuery(this).unbind("load"), b2.hide();
                        }));
                }),
                    e.hasClass("quickview-more-views-owlslider") ? b.goQuickViewCarousel(e) : b.goQuickViewVerticalMoreview(e);
            } else c.find(".quickview-more-views").remove(), c.find(".quickview-more-view-wrapper-jcarousel").remove();
        },
        goQuickView: function () {
            jQuery(".quickview-button a").click(function () {
                var a2 = jQuery(this).attr("id");
                return (
                    Shopify.getProduct(a2, function (a3) {
                        var c = jQuery("#quickview-popup").html();
                        jQuery(".product-quickview").html(c);
                        var d = a3.description.indexOf("pre-order-label");
                        d > 0 && (jQuery(".actions").addClass("pre"), jQuery(".actions .ajax_addtocart").append("<span>Pre-Order</span>"));
                        var e = jQuery(".product-quickview");
                        if (
                            (e.find(".product-name a").html(b.translateText(a3.title)),
                            e.find(".title-products a").attr("href", a3.url),
                            e.find(".product-vendor span").length > 0 && e.find(".product-vendor span").text(a3.vendor),
                            e.find(".product-type span").length > 0 && e.find(".product-type span").text(a3.type),
                            e.find(".product-inventory span").length > 0)
                        ) {
                            var f = a3.variants[0].inventory_quantity;
                            f > 0
                                ? a3.variants[0].inventory_management != null
                                    ? e.find(".product-inventory span").text(f + " in stock")
                                    : e.find(".product-inventory span").text("Many in stock")
                                : e.find(".product-inventory span").text("Out of stock");
                        }
                        if (e.find(".product-description").length > 0) {
                            var g = a3.description.replace(/(<([^>]+)>)/gi, ""),
                                g = g.replace(/\[countdown\](.*)\[\/countdown\]/gi, ""),
                                g = g.replace(/\[item-gallery]/gi, ""),
                                g = g.replace(/\[label-icon-new]/gi, ""),
                                g = g.replace(/\[pre-order-label]/gi, ""),
                                g = g.replace(/\[video\](.*)\[\/video\]/gi, ""),
                                g = g.replace(/\[short-description\](.*)\[\/short-description\]/gi, ""),
                                g = g.replace(/\[custom_html\](.*)\[\/custom_html\]/gi, ""),
                                g = g.replace(/\[tabs\](.*)/gi, ""),
                                g = g.replace(/\[tab\](.*)\[\/tab\]/gi, ""),
                                g = g.replace(/\[tabs\](.*)\[\/tabs\]/gi, "");
                            if (window.multi_lang && g.indexOf("[lang2]") > 0) {
                                var h = g.split("[lang2]");
                                g = jQuery.cookie("language") != null ? h[translator.current_lang - 1] : h[0];
                            }
                            (g = g.split(" ").splice(0, 20).join(" ") + "..."), e.find(".product-description").text(g);
                        } else e.find(".product-description").remove();
                        e.find(".product-description").text(g),
                            e.find(".price").html(Shopify.formatMoney(a3.price, window.money_format)),
                            e.find(".product-item").attr("id", "product-" + a3.id),
                            e.find(".variants").attr("id", "product-actions-" + a3.id),
                            e.find(".variants select").attr("id", "product-select-" + a3.id),
                            a3.compare_at_price > a3.price
                                ? (e.find(".compare-price").html(Shopify.formatMoney(a3.compare_at_price_max, window.money_format)).show(), e.find(".price").addClass("on-sale"))
                                : (e.find(".compare-price").html(""), e.find(".price").removeClass("on-sale")),
                            a3.available
                                ? (e.find(".total-price span").html(Shopify.formatMoney(a3.price, window.money_format)), window.use_color_swatch ? b.createQuickViewVariantsSwatch(a3, e) : b.createQuickViewVariants(a3, e))
                                : (e.find("select, input, .total-price, .dec, .inc, .variants label").remove(), e.find(".ajax_addtocart").text(window.inventory_text.unavailable).addClass("disabled").attr("disabled", "disabled")),
                            e.find(".button").on("click", function () {
                                var a4 = e.find(".quantity").val(),
                                    c2 = 1;
                                jQuery(this).text() == "+" ? (c2 = parseInt(a4) + 1) : a4 > 1 && (c2 = parseInt(a4) - 1), e.find(".quantity").val(c2), e.find(".total-price").length > 0 && b.updatePricingQuickview();
                            }),
                            window.show_multiple_currencies && Currency.convertAll(window.shop_currency, jQuery("#currencies .currency.selected").data("currency"), "span.money", "money_format"),
                            b.loadQuickViewSlider(a3, e),
                            b.goQuickviewAddToCart(),
                            b.translateBlock(".product-quickview"),
                            jQuery(".product-quickview").fadeIn(500),
                            jQuery(".product-quickview .total-price").length > 0 && jQuery(".product-quickview input[name=quantity]").on("change", b.updatePricingQuickview);
                    }),
                    !1
                );
            });
        },
        updatePricingQuickview: function () {
            var a2 = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g,
                b2 = jQuery(".product-quickview .price").text().match(a2);
            if ((b2 || ((a2 = /([0-9]+[.|,][0-9]+)/g), (b2 = jQuery(".product-quickview .price").text().match(a2))), b2)) {
                var c = b2[0],
                    d = c.replace(/[.|,]/g, ""),
                    e = parseInt(jQuery(".product-quickview input[name=quantity]").val()),
                    f = d * e,
                    g = Shopify.formatMoney(f, window.money_format);
                g = g.match(a2)[0];
                var h = new RegExp(r, "g"),
                    i2 = jQuery(".product-quickview .price").html().replace(h, g);
                jQuery(".product-quickview .total-price span").html(i2);
            }
        },
        goQuickviewAddToCart: function () {
            jQuery(".product-quickview .ajax_addtocart").length > 0 &&
                jQuery(".product-quickview .ajax_addtocart").click(function () {
                    var a2 = jQuery(".product-quickview select[name=id]").val();
                    a2 || (a2 = jQuery(".product-quickview input[name=id]").val());
                    var c = jQuery(".product-quickview input[name=quantity]").val();
                    c || (c = 1);
                    var d = jQuery(".product-quickview .title-products a").text(),
                        e = jQuery(".product-quickview .quickview-featured-image img").attr("src");
                    b.doAjaxAddToCart(a2, c, d, e), b.closeQuickViewPopup();
                });
        },
        updateDropdownCart: function () {
            Shopify.getCart(function (a2) {
                b.doUpdateDropdownCart(a2);
            });
        },
        doUpdateDropdownCart: function (b2) {
            a("#cart-count").text(b2.item_count);
        },
        convertToSlug: function (b2) {
            return a
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
        },
        updateDropdownCart: function () {
            Shopify.getCart(function (a2) {
                b.doUpdateDropdownCart(a2);
            });
        },
        doUpdateDropdownCart: function (c) {
            var d =
                '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-inner"><a href="javascript:void(0)" title="Remove Item" class="btn-remove"><i class="ti-close"></i></a><p class="product-name"><a href="{URL}">{TITLE}</a></p><div class="cart-collateral"><span class="price">{PRICE}</span>Qty:  {QUANTITY}</div></div></li>';
            if (
                (a("#cart-count").text(c.item_count),
                a("#cartToggle .price-cart-mini").html(Shopify.formatMoney(c.total_price, window.money_format)),
                a("#dropdown-cart .summary .price").html(Shopify.formatMoney(c.total_price, window.money_format)),
                a("#dropdown-cart .cart-list").html(""),
                c.item_count > 0)
            ) {
                for (var e = 0; e < c.items.length; e++) {
                    var f = d;
                    (f = f.replace(/\{ID\}/g, c.items[e].id)),
                        (f = f.replace(/\{URL\}/g, c.items[e].url)),
                        (f = f.replace(/\{TITLE\}/g, b.translateText(c.items[e].title))),
                        (f = f.replace(/\{TITLE\}/g, c.items[e].title)),
                        (f = f.replace(/\{QUANTITY\}/g, c.items[e].quantity)),
                        (f = f.replace(/\{IMAGE\}/g, Shopify.resizeImage(c.items[e].image, "small"))),
                        (f = f.replace(/\{PRICE\}/g, Shopify.formatMoney(c.items[e].price, window.money_format))),
                        a("#dropdown-cart .cart-list").append(f);
                }
                a("#dropdown-cart .btn-remove").click(function (c2) {
                    c2.preventDefault();
                    var d2 = a(this).parents(".item").attr("id");
                    (d2 = d2.match(/\d+/g)),
                        Shopify.removeItem(d2, function (a2) {
                            b.doUpdateDropdownCart(a2);
                        });
                }),
                    b.checkNeedToConvertCurrency() && Currency.convertAll(window.shop_currency, jQuery("#currencies .currency.selected").data("currency"), "#dropdown-cart span.money", "money_format");
            }
            b.checkItemsInDropdownCart();
        },
        checkNeedToConvertCurrency: function () {
            return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
        },
        loadQuickViewSlider: function (a2, c) {
            var d = Shopify.resizeImage(a2.featured_image, "original");
            c.find(".quickview-featured-images").append(
                '<a href="' +
                    a2.url +
                    '"><img src="' +
                    d +
                    '" title="' +
                    a2.title +
                    '"/><div style="height: 100%; width: 100%; top:0; left:0 z-index: 2000; position: absolute; display: none; background: url(' +
                    window.loading_url +
                    ') 50% 50% no-repeat;"></div></a>'
            );
            var e = c.find(".more-view ul");
            for (i in a2.images) {
                var f = Shopify.resizeImage(a2.images[i], "original"),
                    g = Shopify.resizeImage(a2.images[i], "original"),
                    h = '<li><a href="javascript:void(0)" data-image="' + f + '"><img src="' + g + '"  /></a></li>';
                e.append(h);
            }
            e.find("a").click(function () {
                var a3 = c.find(".quickview-featured-image img"),
                    b2 = c.find(".quickview-featured-image div");
                a3.attr("src") != jQuery(this).attr("data-image") &&
                    (a3.attr("src", jQuery(this).attr("data-image")),
                    b2.show(),
                    a3.load(function (a4) {
                        b2.hide(), jQuery(this).unbind("load"), b2.hide();
                    }));
            }),
                e.hasClass("quickview-more-views-owlslider") ? b.goQuickViewCarousel(e) : b.goQuickViewVerticalMoreview(e);
        },
        goQuickViewCarousel: function (a2) {
            a2 &&
                a2
                    .owlCarousel({
                        itemsCustom: [
                            [320, 1],
                            [767, 1],
                            [768, 1],
                            [1024, 1],
                            [1025, 1],
                            [1600, 1],
                        ],
                        autoPlay: !0,
                        navigation: !0,
                        navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                        pagination: !1,
                    })
                    .css("visibility", "visible");
        },
        goQuickViewVerticalMoreview: function (a2) {},
        convertToSlug: function (a2) {
            return a2
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
        },
        createQuickViewVariantsSwatch: function (a2, b2) {
            if (a2.variants.length > 1) {
                for (var c = 0; c < a2.variants.length; c++) {
                    var d = a2.variants[c],
                        e = '<option value="' + d.id + '">' + d.title + "</option>";
                    b2.find("form.variants > select").append(e);
                }
                new Shopify.OptionSelectors("product-select-" + a2.id, { product: a2, onVariantSelected: selectCallbackQuickview });
                for (var f = window.file_url.substring(0, window.file_url.lastIndexOf("?")), h = (window.asset_url.substring(0, window.asset_url.lastIndexOf("?")), ""), c = 0; c < a2.options.length; c++) {
                    var i2 = !1;
                    /Color|Colour/i.test(a2.options[c].name) && (i2 = !0),
                        (h += '<div class="swatch clearfix swatch-' + c + " " + (i2 ? "color" : "") + '" data-option-index="' + c + '">'),
                        (h += '<div class="header">' + a2.options[c].name + "</div>");
                    for (var j = new Array(), k = 0; k < a2.variants.length; k++) {
                        var d = a2.variants[k],
                            l = d.options[c],
                            m = this.convertToSlug(l),
                            n = "swatch-" + c + "-" + m;
                        j.indexOf(l) < 0 &&
                            ((h += '<div data-value="' + l + '" class="swatch-element ' + (i2 ? "color" : "") + m + (d.available ? " available " : " soldout ") + '">'),
                            (h += '<input id="' + n + '" type="radio" name="option-' + c + '" value="' + l + '" ' + (k == 0 ? " checked " : "") + (d.available ? "" : " disabled") + " />"),
                            (h += i2
                                ? '<label for="' + n + '" style="background-color: ' + m + "; background-image: url(" + f + m + '.png)"><img class="crossed-out" src="' + f + 'soldout.png" /></label>'
                                : '<label for="' + n + '">' + l + '<img class="crossed-out" src="' + f + 'soldout.png" /></label>'),
                            (h += "</div>"),
                            d.available &&
                                jQuery('.product-quickview .swatch[data-option-index="' + c + '"] .' + m)
                                    .removeClass("soldout")
                                    .addClass("available")
                                    .find(":radio")
                                    .removeAttr("disabled"),
                            j.push(l));
                    }
                    h += "</div>";
                }
                b2.find("form.variants > select").after(h),
                    b2.find(".swatch :radio").change(function () {
                        var a3 = jQuery(this).closest(".swatch").attr("data-option-index"),
                            b3 = jQuery(this).val();
                        jQuery(this).closest("form").find(".single-option-selector").eq(a3).val(b3).trigger("change");
                    }),
                    a2.available && ((Shopify.optionsMap = {}), Shopify.linkOptionSelectors(a2));
            } else {
                b2.find("form.variants > select").remove();
                var o = '<input type="hidden" name="id" value="' + a2.variants[0].id + '">';
                b2.find("form.variants").append(o);
            }
        },
        createQuickViewVariants: function (a2, b2) {
            if (a2.variants.length > 1) {
                for (var c = 0; c < a2.variants.length; c++) {
                    var d = a2.variants[r],
                        e = '<option value="' + d.id + '">' + d.title + "</option>";
                    b2.find("form.variants > select").append(e);
                }
                new Shopify.OptionSelectors("product-select-" + a2.id, { product: a2, onVariantSelected: selectCallbackQuickview }),
                    jQuery(".product-quickview .single-option-selector").selectize(),
                    jQuery(".product-quickview .selectize-input input").attr("disabled", "disabled"),
                    a2.options.length == 1 && jQuery(".selector-wrapper:eq(0)").prepend("<label>" + a2.options[0].name + "</label>"),
                    b2.find("form.variants .selector-wrapper label").each(function (b3, c2) {
                        jQuery(this).html(a2.options[b3].name);
                    });
            } else {
                b2.find("form.variants > select").remove();
                var f = '<input type="hidden" name="id" value="' + a2.variants[0].id + '">';
                b2.find("form.variants").append(f);
            }
        },
        closeQuickViewPopup: function () {
            jQuery(".product-quickview").fadeOut(500);
        },
        translateText: function (a2) {
            if (!window.multi_lang || a2.indexOf("|") < 0) return a2;
            if (window.multi_lang) {
                var b2 = a2.split("|");
                return translator.isLang2() ? b2[1] : b2[0];
            }
        },
        translateBlock: function (a2) {
            window.multi_lang && translator.isLang2() && translator.doTranslate(a2);
        },
    };
    a(document).ready(function () {
        a(".up-qty").click(function () {
            (quantity = a("#quantity").val()), a("#quantity").val(parseInt(quantity) + 1);
        }),
            a(".down-qty").click(function () {
                (quantity = a("#quantity").val()), quantity > 1 && a("#quantity").val(parseInt(quantity) - 1);
            });
    });
})(jQuery);
//# sourceMappingURL=/cdn/shop/t/13/assets/ajax.jquery.js.map?v=68575628920466263781693476769
