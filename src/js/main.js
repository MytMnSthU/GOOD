import $ from "jquery";

import "../scss/main.scss";

$(function () {
   (async () => {
      let foods = [];

      // Functions
      let updatePrice = function () {
         $("#currval").text($("#pricerange").val());
      };

      let fetchData = async function (category) {
         try {
            const result = await $.get(
               `https://ig-food-menus.herokuapp.com/${category}`
            );
            return result;
         } catch (error) {
            console.log(error);
         }
      };

      let setData = async function (category = "bbqs") {
         await fetchData(category)
            .then((resources) => {
               const result = resources.map((res) => {
                  return { img: res.img, name: res.name, price: res.price };
               });
               foods = [...result];
            })
            .catch((err) => {
               console.error(err);
            });
      };

      let createCardComponent = function (data = foods) {
         $("#cardgroup").html(
            `
            ${data
               .filter((val, idx) => idx < 13)
               .map((food, id) => {
                  return `
                  <div class=" custom-style  card-group__card">
                     <div class=" p-2">
                        <figure>
                           <img src=${food.img} class="cart-group__img " alt=${food.img} />
                           
                        </figure>
                        <div class="d-flex justify-content-between align-items-center py-2 px-2 gap-2">
                           <div>
                              <h4 class="fs-16 m-0">${food.name}</h4>
                              <span class="fs-12">$${food.price}</span>
                           </div>
                           <button type="button" class="btn rounded-circle btn-outline-dark">
                              <i class="fas fa-plus"></i>
                           </button>
                        </div>
                     </div>
                  </div>
               `;
               })
               .join("")}
            `
         );

         $(".card-group__card").each((idx, val) => {
            $(val).css("animation-delay", `${0.2 * idx}s`);
         });
      };

      let sortCardComponent = function () {
         // 0 ===> low to high
         // 1 ===> high to low
         let val = $("#sortfilter").val(); 
         // console.log($(this).val());
         let tempFoods = [...foods];
         // console.log(tempFoods);

         if (val == 0) {
            tempFoods.sort((a, b) => a.price - b.price);
            createCardComponent(tempFoods);
         } else {
            tempFoods.sort((a, b) => b.price - a.price);
            createCardComponent(tempFoods);
         }
      }

      await setData();
      createCardComponent();

      // Events
      $(document).on("change input", "#pricerange", function () {
         updatePrice();

         let currMax = $(this).val();
         const limitedPriceFoods = foods.filter((food) => food.price < currMax);
         createCardComponent(limitedPriceFoods);

         $("img").on("error", function () {
            // $(this).parent().parent().parent().hide();
            // console.log($(this).closest(".card-group__card").attr('class'));
            $(this).closest(".card-group__card").hide();
         });
      });

      $(document).on("click", ".site-filter__link", async function () {
         let category = $(this).text();

         $(".site-filter__link").each((idx, link) => {
            $(link).removeClass("active");
         });
         $(this).addClass("active");

         await setData(category);
         createCardComponent();
         sortCardComponent();
         // console.log(foods);

         $("#cardgroup").append(
            `
            <span class="loader-wrapper">
               <span class="loader">
                     <span class="circle"></span>
               </span>
            </span>
            `
         );

         $(document).scrollTop(0);

         $("img").on("error", function () {
            // $(this).parent().parent().parent().hide();
            // console.log($(this).closest(".card-group__card").attr('class'));
            $(this).closest(".card-group__card").hide();
         });

         $("img").on("load", function () {
            // setTimeout(() => {
            $(".loader-wrapper").hide();
            // }, 1000);
         });
      });

      $("img").on("error", function () {
         // $(this).parent().parent().parent().hide();
         $(this).closest(".card-group__card").hide();
      });

      $("img").on("load", function () {
         // setTimeout(() => {
         $(".loader-wrapper").hide();
         // }, 1000);
      });

      $("#sortfilter").on("change", function () {
         sortCardComponent();

         $("img").on("error", function () {
            // $(this).parent().parent().parent().hide();
            $(this).closest(".card-group__card").hide();
         });
      });


      $("#filterbtn").on("click", function () { 
         $("#sitefilter").toggleClass('open');
         $('body').toggleClass('hideover');
         
       });


     


      
   })();
});
