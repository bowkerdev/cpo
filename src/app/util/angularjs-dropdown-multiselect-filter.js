(function(angular) {
'use strict';
   function dealWithInputString(string){
    return string.replace(/ \n/g,',')
                 .replace(/\n/g,',')
                 .replace(/,$/gi,'')
                 .replace(/\s*$/g,"")
                 .replace(/,$/gi,'')
  }
var directiveModule = angular.module('angularjs-dropdown-multiselect-filter', []);

  var dde = document.documentElement,
    matchingFunction = dde.matches ? 'matches' :
      dde.matchesSelector ? 'matchesSelector' :
        dde.webkitMatches ? 'webkitMatches' :
          dde.webkitMatchesSelector ? 'webkitMatchesSelector' :
            dde.msMatches ? 'msMatches' :
              dde.msMatchesSelector ? 'msMatchesSelector' :
                dde.mozMatches ? 'mozMatches' :
                  dde.mozMatchesSelector ? 'mozMatchesSelector' : null;

  var closestElement = angular.element.prototype.closest || function (selector) {
      var el = this[0].parentNode;
      while (el !== document.documentElement && el != null && !el[matchingFunction](selector)) {
        el = el.parentNode;
      }

      if (el && el[matchingFunction](selector)) {
        return angular.element(el);
      }
      else {
        return angular.element();
      }
    };

  function getWindowScroll() {
    if ('pageYOffset' in window) {
      return {
        scrollTop: pageYOffset,
        scrollLeft: pageXOffset
      };
    }
    else {
      var sx, sy, d = document, r = d.documentElement, b = d.body;
      sx = r.scrollLeft || b.scrollLeft || 0;
      sy = r.scrollTop || b.scrollTop || 0;
      return {
        scrollTop: sy,
        scrollLeft: sx
      };
    }
  }

  function getClientSize(element, sizeProp) {
    if (element === window) {
      return sizeProp === 'clientWidth' ? window.innerWidth : window.innerHeight;
    }
    else {
      return element[sizeProp];
    }
  }

  function getScrollPos(element, scrollProp) {
    return element === window ? getWindowScroll()[scrollProp] : element[scrollProp];
  }

  function getScrollOffset(vsElement, scrollElement, isHorizontal) {
    var vsPos = vsElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
    var scrollPos = scrollElement === window ? 0 : scrollElement.getBoundingClientRect()[isHorizontal ? 'left' : 'top'];
    var correction = vsPos - scrollPos +
      (scrollElement === window ? getWindowScroll() : scrollElement)[isHorizontal ? 'scrollLeft' : 'scrollTop'];

    return correction;
  }

  directiveModule.directive('vsRepeat', ['$compile', '$parse', function($compile, $parse) {
    return {
      restrict: 'A',
      scope: true,
      compile: function($element, $attrs) {
        var repeatContainer = angular.isDefined($attrs.vsRepeatContainer) ? angular.element($element[0].querySelector($attrs.vsRepeatContainer)) : $element,
          ngRepeatChild = repeatContainer.children().eq(0),
          ngRepeatExpression,
          childCloneHtml = ngRepeatChild[0]?ngRepeatChild[0].outerHTML:undefined,
          expressionMatches,
          lhs,
          rhs,
          rhsSuffix,
          originalNgRepeatAttr,
          collectionName = '$vs_collection',
          isNgRepeatStart = false,
          attributesDictionary = {
            'vsRepeat': 'elementSize',
            'vsOffsetBefore': 'offsetBefore',
            'vsOffsetAfter': 'offsetAfter',
            'vsScrolledToEndOffset': 'scrolledToEndOffset',
            'vsScrolledToBeginningOffset': 'scrolledToBeginningOffset',
            'vsExcess': 'excess'
          };

        if (ngRepeatChild.attr('ng-repeat')) {
          originalNgRepeatAttr = 'ng-repeat';
          ngRepeatExpression = ngRepeatChild.attr('ng-repeat');
        }
        else if (ngRepeatChild.attr('data-ng-repeat')) {
          originalNgRepeatAttr = 'data-ng-repeat';
          ngRepeatExpression = ngRepeatChild.attr('data-ng-repeat');
        }
        else if (ngRepeatChild.attr('ng-repeat-start')) {
          isNgRepeatStart = true;
          originalNgRepeatAttr = 'ng-repeat-start';
          ngRepeatExpression = ngRepeatChild.attr('ng-repeat-start');
        }
        else if (ngRepeatChild.attr('data-ng-repeat-start')) {
          isNgRepeatStart = true;
          originalNgRepeatAttr = 'data-ng-repeat-start';
          ngRepeatExpression = ngRepeatChild.attr('data-ng-repeat-start');
        }
        else {
          throw new Error('angular-vs-repeat: no ng-repeat directive on a child element');
        }

        expressionMatches = /^\s*(\S+)\s+in\s+([\S\s]+?)(track\s+by\s+\S+)?$/.exec(ngRepeatExpression);
        lhs = expressionMatches[1];
        rhs = expressionMatches[2];
        rhsSuffix = expressionMatches[3];

        if (isNgRepeatStart) {
          var index = 0;
          var repeaterElement = repeatContainer.children().eq(0);
          while(repeaterElement.attr('ng-repeat-end') == null && repeaterElement.attr('data-ng-repeat-end') == null) {
            index++;
            repeaterElement = repeatContainer.children().eq(index);
            childCloneHtml += repeaterElement[0].outerHTML;
          }
        }

        repeatContainer.empty();
        return {
          pre: function($scope, $element, $attrs) {
            var repeatContainer = angular.isDefined($attrs.vsRepeatContainer) ? angular.element($element[0].querySelector($attrs.vsRepeatContainer)) : $element,
              childClone = angular.element(childCloneHtml),
              childTagName = childClone[0].tagName.toLowerCase(),
              originalCollection = [],
              originalLength,
              $$horizontal = typeof $attrs.vsHorizontal !== 'undefined',
              $beforeContent = angular.element('<' + childTagName + ' class="vs-repeat-before-content"></' + childTagName + '>'),
              $afterContent = angular.element('<' + childTagName + ' class="vs-repeat-after-content"></' + childTagName + '>'),
              autoSize = !$attrs.vsRepeat,
              sizesPropertyExists = !!$attrs.vsSize || !!$attrs.vsSizeProperty,
              $scrollParent = $attrs.vsScrollParent ?
                $attrs.vsScrollParent === 'window' ? angular.element(window) :
                  closestElement.call(repeatContainer, $attrs.vsScrollParent) : repeatContainer,
              $$options = 'vsOptions' in $attrs ? $scope.$eval($attrs.vsOptions) : {},
              clientSize = $$horizontal ? 'clientWidth' : 'clientHeight',
              offsetSize = $$horizontal ? 'offsetWidth' : 'offsetHeight',
              scrollPos = $$horizontal ? 'scrollLeft' : 'scrollTop';

            $scope.totalSize = 0;
            if (!('vsSize' in $attrs) && 'vsSizeProperty' in $attrs) {
              console.warn('vs-size-property attribute is deprecated. Please use vs-size attribute which also accepts angular expressions.');
            }
         //   debugger;
            if ($scrollParent.length === 0) {
              throw 'Specified scroll parent selector did not match any element';
            }
            $scope.$scrollParent = $scrollParent;

            if (sizesPropertyExists) {
              $scope.sizesCumulative = [];
            }

            //initial defaults
            $scope.elementSize = (+$attrs.vsRepeat) || getClientSize($scrollParent[0], clientSize) || 50;
            $scope.offsetBefore = 0;
            $scope.offsetAfter = 0;
            $scope.excess = 2;

            if ($$horizontal) {
              $beforeContent.css('height', '100%');
              $afterContent.css('height', '100%');
            }
            else {
              $beforeContent.css('width', '100%');
              $afterContent.css('width', '100%');
            }

            Object.keys(attributesDictionary).forEach(function(key) {
              if ($attrs[key]) {
                $attrs.$observe(key, function(value) {
                  // '+' serves for getting a number from the string as the attributes are always strings
                  $scope[attributesDictionary[key]] = +value;
                  reinitialize();
                });
              }
            });


            $scope.$watchCollection(rhs, function(coll) {
              originalCollection = coll || [];
              refresh();
            });

            function refresh() {
              if (!originalCollection || originalCollection.length < 1) {
                $scope[collectionName] = [];
                originalLength = 0;
                $scope.sizesCumulative = [0];
              }
              else {
                originalLength = originalCollection.length;
                if (sizesPropertyExists) {
                  $scope.sizes = originalCollection.map(function(item) {
                    var s = $scope.$new(false);
                    angular.extend(s, item);
                    s[lhs] = item;
                    var size = ($attrs.vsSize || $attrs.vsSizeProperty) ?
                      s.$eval($attrs.vsSize || $attrs.vsSizeProperty) :
                      $scope.elementSize;
                    s.$destroy();
                    return size;
                  });
                  var sum = 0;
                  $scope.sizesCumulative = $scope.sizes.map(function(size) {
                    var res = sum;
                    sum += size;
                    return res;
                  });
                  $scope.sizesCumulative.push(sum);
                }
                else {
                  setAutoSize();
                }
              }

              reinitialize();
            }

            function setAutoSize() {
              if (autoSize) {
                $scope.$$postDigest(function() {
                  if (repeatContainer[0].offsetHeight || repeatContainer[0].offsetWidth) { // element is visible
                    var children = repeatContainer.children(),
                      i = 0,
                      gotSomething = false,
                      insideStartEndSequence = false;

                    while (i < children.length) {
                      if (children[i].attributes[originalNgRepeatAttr] != null || insideStartEndSequence) {
                        if (!gotSomething) {
                          $scope.elementSize = 0;
                        }

                        gotSomething = true;
                        if (children[i][offsetSize]) {
                          $scope.elementSize += children[i][offsetSize];
                        }

                        if (isNgRepeatStart) {
                          if (children[i].attributes['ng-repeat-end'] != null || children[i].attributes['data-ng-repeat-end'] != null) {
                            break;
                          }
                          else {
                            insideStartEndSequence = true;
                          }
                        }
                        else {
                          break;
                        }
                      }
                      i++;
                    }

                    if (gotSomething) {
                      reinitialize();
                      autoSize = false;
                      if ($scope.$root && !$scope.$root.$$phase) {
                        $scope.$apply();
                      }
                    }
                  }
                  else {
                    var dereg = $scope.$watch(function() {
                      if (repeatContainer[0].offsetHeight || repeatContainer[0].offsetWidth) {
                        dereg();
                        setAutoSize();
                      }
                    });
                  }
                });
              }
            }

            function getLayoutProp() {
              var layoutPropPrefix = childTagName === 'tr' ? '' : 'min-';
              var layoutProp = $$horizontal ? layoutPropPrefix + 'width' : layoutPropPrefix + 'height';
              return layoutProp;
            }

            childClone.eq(0).attr(originalNgRepeatAttr, lhs + ' in ' + collectionName + (rhsSuffix ? ' ' + rhsSuffix : ''));
            childClone.addClass('vs-repeat-repeated-element');

            repeatContainer.append($beforeContent);
            repeatContainer.append(childClone);
            $compile(childClone)($scope);
            repeatContainer.append($afterContent);

            $scope.startIndex = 0;
            $scope.endIndex = 0;

            function scrollHandler() {
              if (updateInnerCollection()) {
                $scope.$digest();
              }
            }

            $scrollParent.on('scroll', scrollHandler);

            function onWindowResize() {
              if (typeof $attrs.vsAutoresize !== 'undefined') {
                autoSize = true;
                setAutoSize();
                if ($scope.$root && !$scope.$root.$$phase) {
                  $scope.$apply();
                }
              }
              if (updateInnerCollection()) {
                $scope.$apply();
              }
            }

            angular.element(window).on('resize', onWindowResize);
            $scope.$on('$destroy', function() {
              angular.element(window).off('resize', onWindowResize);
              $scrollParent.off('scroll', scrollHandler);
            });

            $scope.$on('vsRepeatTrigger', refresh);

            $scope.$on('vsRepeatResize', function() {
              autoSize = true;
              setAutoSize();
            });

            var _prevStartIndex,
              _prevEndIndex,
              _minStartIndex,
              _maxEndIndex;

            $scope.$on('vsRenderAll', function() {//e , quantum) {
              if($$options.latch) {
                setTimeout(function() {
                  // var __endIndex = Math.min($scope.endIndex + (quantum || 1), originalLength);
                  var __endIndex = originalLength;
                  _maxEndIndex = Math.max(__endIndex, _maxEndIndex);
                  $scope.endIndex = $$options.latch ? _maxEndIndex : __endIndex;
                  $scope[collectionName] = originalCollection.slice($scope.startIndex, $scope.endIndex);
                  _prevEndIndex = $scope.endIndex;

                  $scope.$$postDigest(function() {
                    $beforeContent.css(getLayoutProp(), 0);
                    $afterContent.css(getLayoutProp(), 0);
                  });

                  $scope.$apply(function() {
                    $scope.$emit('vsRenderAllDone');
                  });
                });
              }
            });

            function reinitialize() {
              _prevStartIndex = void 0;
              _prevEndIndex = void 0;
              _minStartIndex = originalLength;
              _maxEndIndex = 0;
              updateTotalSize(sizesPropertyExists ?
                  $scope.sizesCumulative[originalLength] :
                $scope.elementSize * originalLength
              );
              updateInnerCollection();

              $scope.$emit('vsRepeatReinitialized', $scope.startIndex, $scope.endIndex);
            }

            function updateTotalSize(size) {
              $scope.totalSize = $scope.offsetBefore + size + $scope.offsetAfter;
            }

            var _prevClientSize;
            function reinitOnClientHeightChange() {
              var ch = getClientSize($scrollParent[0], clientSize);
              if (ch !== _prevClientSize) {
                reinitialize();
                if ($scope.$root && !$scope.$root.$$phase) {
                  $scope.$apply();
                }
              }
              _prevClientSize = ch;
            }

            $scope.$watch(function() {
              if (typeof window.requestAnimationFrame === 'function') {
                window.requestAnimationFrame(reinitOnClientHeightChange);
              }
              else {
                reinitOnClientHeightChange();
              }
            });

            function updateInnerCollection() {
              var $scrollPosition = getScrollPos($scrollParent[0], scrollPos);
              var $clientSize = getClientSize($scrollParent[0], clientSize);

              var scrollOffset = repeatContainer[0] === $scrollParent[0] ? 0 : getScrollOffset(
                repeatContainer[0],
                $scrollParent[0],
                $$horizontal
              );

              var __startIndex = $scope.startIndex;
              var __endIndex = $scope.endIndex;

              if (sizesPropertyExists) {
                __startIndex = 0;
                while ($scope.sizesCumulative[__startIndex] < $scrollPosition - $scope.offsetBefore - scrollOffset) {
                  __startIndex++;
                }
                if (__startIndex > 0) { __startIndex--; }

                // Adjust the start index according to the excess
                __startIndex = Math.max(
                  Math.floor(__startIndex - $scope.excess / 2),
                  0
                );

                __endIndex = __startIndex;
                while ($scope.sizesCumulative[__endIndex] < $scrollPosition - $scope.offsetBefore - scrollOffset + $clientSize) {
                  __endIndex++;
                }

                // Adjust the end index according to the excess
                __endIndex = Math.min(
                  Math.ceil(__endIndex + $scope.excess / 2),
                  originalLength
                );
              }
              else {
                __startIndex = Math.max(
                  Math.floor(
                    ($scrollPosition - $scope.offsetBefore - scrollOffset) / $scope.elementSize
                  ) - $scope.excess / 2,
                  0
                );

                __endIndex = Math.min(
                  __startIndex + Math.ceil(
                    $clientSize / $scope.elementSize
                  ) + $scope.excess,
                  originalLength
                );
              }

              _minStartIndex = Math.min(__startIndex, _minStartIndex);
              _maxEndIndex = Math.max(__endIndex, _maxEndIndex);

              $scope.startIndex = $$options.latch ? _minStartIndex : __startIndex;
              $scope.endIndex = $$options.latch ? _maxEndIndex : __endIndex;

              // Move to the end of the collection if we are now past it
              if (_maxEndIndex < $scope.startIndex)
                $scope.startIndex = _maxEndIndex;

              var digestRequired = false;
              if (_prevStartIndex == null) {
                digestRequired = true;
              }
              else if (_prevEndIndex == null) {
                digestRequired = true;
              }

              if (!digestRequired) {
                if ($$options.hunked) {
                  if (Math.abs($scope.startIndex - _prevStartIndex) >= $scope.excess / 2 ||
                    ($scope.startIndex === 0 && _prevStartIndex !== 0)) {
                    digestRequired = true;
                  }
                  else if (Math.abs($scope.endIndex - _prevEndIndex) >= $scope.excess / 2 ||
                    ($scope.endIndex === originalLength && _prevEndIndex !== originalLength)) {
                    digestRequired = true;
                  }
                }
                else {
                  digestRequired = $scope.startIndex !== _prevStartIndex ||
                    $scope.endIndex !== _prevEndIndex;
                }
              }

              if (digestRequired) {
                $scope[collectionName] = originalCollection.slice($scope.startIndex, $scope.endIndex);

                // Emit the event
                $scope.$emit('vsRepeatInnerCollectionUpdated', $scope.startIndex, $scope.endIndex, _prevStartIndex, _prevEndIndex);
                var triggerIndex;
                if ($attrs.vsScrolledToEnd) {
                  triggerIndex = originalCollection.length - ($scope.scrolledToEndOffset || 0);
                  if (($scope.endIndex >= triggerIndex && _prevEndIndex < triggerIndex) || (originalCollection.length && $scope.endIndex === originalCollection.length)) {
                    $scope.$eval($attrs.vsScrolledToEnd);
                  }
                }
                if ($attrs.vsScrolledToBeginning) {
                  triggerIndex = $scope.scrolledToBeginningOffset || 0;
                  if (($scope.startIndex <= triggerIndex && _prevStartIndex > $scope.startIndex)) {
                    $scope.$eval($attrs.vsScrolledToBeginning);
                  }
                }

                _prevStartIndex = $scope.startIndex;
                _prevEndIndex = $scope.endIndex;

                var offsetCalculationString = sizesPropertyExists ?
                  '(sizesCumulative[$index + startIndex] + offsetBefore)' :
                  '(($index + startIndex) * elementSize + offsetBefore)';

                var parsed = $parse(offsetCalculationString);
                var o1 = parsed($scope, {$index: 0});
                var o2 = parsed($scope, {$index: $scope[collectionName].length});
                var total = $scope.totalSize;

                $beforeContent.css(getLayoutProp(), o1 + 'px');
                $afterContent.css(getLayoutProp(), (total - o2) + 'px');
              }

              return digestRequired;
            }
          }
        };
      }
    };
  }]);

  directiveModule.directive('fastRepeat', ['$compile', '$parse', '$animate', function ($compile, $parse, $animate) {
    'use strict';
    var $ = angular.element;

    var fastRepeatId = 0,
      showProfilingInfo = false,
      isGteAngular14 = /^(\d+\.\d+)\./.exec(angular.version.full)[1] > 1.3;

    // JSON.stringify replacer function which removes any keys that start with $$.
    // This prevents unnecessary updates when we watch a JSON stringified value.
    function JSONStripper(key, value) {
      if(key.slice && key.slice(0,2) == '$$') { return undefined; }
      return value;
    }

    function getTime() { // For profiling
      if(window.performance && window.performance.now) { return window.performance.now(); }
      else { return (new Date()).getTime(); }
    }

    return {
      restrict: 'A',
      transclude: 'element',
      priority: 1000,
      compile: function(tElement, tAttrs) {
        return function link(listScope, element, attrs, ctrl, transclude) {
          var repeatParts = attrs.fastRepeat.split(' in ');
          var repeatListName = repeatParts[1], repeatVarName = repeatParts[0];
          var getter = $parse(repeatListName); // getter(scope) should be the value of the list.
          var disableOpts = $parse(attrs.fastRepeatDisableOpts)(listScope);
          var currentRowEls = {};
          var t;

          // The rowTpl will be digested once -- want to make sure it has valid data for the first wasted digest.  Default to first row or {} if no rows
          var scope = listScope.$new();
          scope[repeatVarName] = getter(scope)[0] || {};
          scope.fastRepeatStatic = true; scope.fastRepeatDynamic = false;


          // Transclude the contents of the fast repeat.
          // This function is called for every row. It reuses the rowTpl and scope for each row.
          var rowTpl = transclude(scope, function(rowTpl, scope) {
            if (isGteAngular14) {
              $animate.enabled(rowTpl, false);
            } else {
              $animate.enabled(false, rowTpl);
            }
          });

          // Create an offscreen div for the template
          var tplContainer = $("<div/>");
          $('body').append(tplContainer);
          scope.$on('$destroy', function() {
            tplContainer.remove();
            rowTpl.remove();
          });
          tplContainer.css({position: 'absolute', top: '-100%'});
          var elParent = element.parents().filter(function() { return $(this).css('display') !== 'inline'; }).first();
          tplContainer.width(elParent.width());
          tplContainer.css({visibility: 'hidden'});

          tplContainer.append(rowTpl);

          var updateList = function(rowTpl, scope, forceUpdate) {
            function render(item) {
              scope[repeatVarName] = item;
              scope.$digest();
              rowTpl.attr('fast-repeat-id', item.$$fastRepeatId);
              return rowTpl.clone();
            }


            var list = getter(scope);
            // Generate ids if necessary and arrange in a hash map
            var listByIds = {};
            angular.forEach(list, function(item) {
              if(!item.$$fastRepeatId) {
                if(item.id) { item.$$fastRepeatId = item.id; }
                else if(item._id) { item.$$fastRepeatId = item._id; }
                else { item.$$fastRepeatId = ++fastRepeatId; }
              }
              listByIds[item.$$fastRepeatId] = item;
            });

            // Delete removed rows
            angular.forEach(currentRowEls, function(row, id) {
              if(!listByIds[id]) {
                row.el.detach();
              }
            });
            // Add/rearrange all rows
            var previousEl = element;
            angular.forEach(list, function(item) {
              var id = item.$$fastRepeatId;
              var row=currentRowEls[id];


              if(row) {
                // We've already seen this one
                if((!row.compiled && (forceUpdate || !angular.equals(row.copy, item))) || (row.compiled && row.item!==item)) {
                  // This item has not been compiled and it apparently has changed -- need to rerender
                  var newEl = render(item);
                  row.el.replaceWith(newEl);
                  row.el = newEl;
                  row.copy = angular.copy(item);
                  row.compiled = false;
                  row.item = item;
                }
              } else {
                // This must be a new node

                if(!disableOpts) {
                  row = {
                    copy: angular.copy(item),
                    item: item,
                    el: render(item)
                  };
                } else {
                  // Optimizations are disabled
                  row = {
                    copy: angular.copy(item),
                    item: item,
                    el: $('<div/>'),
                    compiled: true
                  };

                  renderUnoptimized(item, function(newEl) {
                    row.el.replaceWith(newEl);
                    row.el=newEl;
                  });
                }

                currentRowEls[id] =  row;
              }
              previousEl.after(row.el.last());
              previousEl = row.el.last();
            });

          };


          // Here is the main watch. Testing has shown that watching the stringified list can
          // save roughly 500ms per digest in certain cases.
          // JSONStripper is used to remove the $$fastRepeatId that we attach to the objects.
          var busy=false;
          listScope.$watch(function(scp){ return JSON.stringify(getter(scp), JSONStripper); }, function(list) {
            tplContainer.width(elParent.width());

            if(busy) { return; }
            busy=true;

            if (showProfilingInfo) {
              t = getTime();
            }

            // Rendering is done in a postDigest so that we are outside of the main digest cycle.
            // This allows us to digest the individual row scope repeatedly without major hackery.
            listScope.$$postDigest(function() {
              tplContainer.width(elParent.width());
              scope.$digest();

              updateList(rowTpl, scope);
              if (showProfilingInfo) {
                t = getTime() - t;
                console.log("Total time: ", t, "ms");
                console.log("time per row: ", t/list.length);
              }
              busy=false;
            });
          }, false);

          function renderRows() {
            listScope.$$postDigest(function() {
              tplContainer.width(elParent.width());
              scope.$digest();
              updateList(rowTpl, scope, true);
            });
          }
          if(attrs.fastRepeatWatch) {
            listScope.$watch(attrs.fastRepeatWatch, renderRows, true);
          }
          listScope.$on('fastRepeatForceRedraw', renderRows);

          function renderUnoptimized(item, cb) {
            var newScope = scope.$new(false);

            newScope[repeatVarName] = item;
            newScope.fastRepeatStatic = false; newScope.fastRepeatDynamic = true;
            var clone = transclude(newScope, function(clone) {
              tplContainer.append(clone);
            });

            newScope.$$postDigest(function() {
              cb(clone);
            });

            newScope.$digest();

            return newScope;
          }

          var parentClickHandler = function parentClickHandler(evt) {
            var $target = $(this);
            if($target.parents().filter('[fast-repeat-id]').length) {
              return; // This event wasn't meant for us
            }
            evt.stopPropagation();

            var rowId = $target.attr('fast-repeat-id');
            var item = currentRowEls[rowId].item;


            // Find index of clicked dom element in list of all children element of the row.
            // -1 would indicate the row itself was clicked.
            var elIndex = $target.find('*').index(evt.target);
            var newScope = renderUnoptimized(item, function(clone) {
              $target.replaceWith(clone);

              currentRowEls[rowId] = {
                compiled: true,
                el: clone,
                item: item
              };

              setTimeout(function() {
                if(elIndex >= 0) {
                  clone.find('*').eq(elIndex).trigger('click');
                } else {
                  clone.trigger('click');
                }
              }, 0);
            });

            newScope.$digest();
          };


          element.parent().on('click', '[fast-repeat-id]',parentClickHandler);

          // Handle resizes
          //
          var onResize = function() {
            tplContainer.width(elParent.width());
          };

          var jqWindow = $(window);
          jqWindow.on('resize', onResize);
          scope.$on('$destroy', function() {
            jqWindow.off('resize', onResize);
            element.parent().off('click', '[fast-repeat-id]', parentClickHandler);
          });
        };
      },
    };
  }]);

  directiveModule.filter('multFilterSpecial',[
    function(){

      return function(array,searchFilter){
     //     searchFilter = searchFilter.replace(/ \n/g,',').replace(/\n/g,',');
        searchFilter = dealWithInputString(searchFilter);
          var searchKeys = searchFilter.split(",").concat(searchFilter);
          return array.filter(function(item){
             return  searchKeys.reduce(function(result,nnew){
               result = result||(item&&(item.id.indexOf(nnew)!=-1));
               return result;
              },false);
          })
      }
    }
  ]);
  directiveModule.factory('filterDebounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    function($rootScope,   $browser,   $q,   $exceptionHandler) {
      var deferreds = {},
        methods = {},
        uuid = 0;

      function debounce(fn, delay, invokeApply) {
        var deferred = $q.defer(),
          promise = deferred.promise,
          skipApply = (angular.isDefined(invokeApply) && !invokeApply),
          timeoutId, cleanup,
          methodId, bouncing = false;

        // check we dont have this method already registered
        angular.forEach(methods, function(value, key) {
          if(angular.equals(methods[key].fn, fn)) {
            bouncing = true;
            methodId = key;
          }
        });

        // not bouncing, then register new instance
        if(!bouncing) {
          methodId = uuid++;
          methods[methodId] = {fn: fn};
        } else {
          // clear the old timeout
          deferreds[methods[methodId].timeoutId].reject('bounced');
          $browser.defer.cancel(methods[methodId].timeoutId);
        }

        var debounced = function() {
          // actually executing? clean method bank
          delete methods[methodId];

          try {
            deferred.resolve(fn());
          } catch(e) {
            deferred.reject(e);
            $exceptionHandler(e);
          }

          if (!skipApply) $rootScope.$apply();
        };

        timeoutId = $browser.defer(debounced, delay);

        // track id with method
        methods[methodId].timeoutId = timeoutId;

        cleanup = function(reason) {
          delete deferreds[promise.$$timeoutId];
        };

        promise.$$timeoutId = timeoutId;
        deferreds[timeoutId] = deferred;
        promise.then(cleanup, cleanup);

        return promise;
      }


      // similar to angular's $timeout cancel
      debounce.cancel = function(promise) {
        if (promise && promise.$$timeoutId in deferreds) {
          deferreds[promise.$$timeoutId].reject('canceled');
          return $browser.defer.cancel(promise.$$timeoutId);
        }
        return false;
      };

      return debounce;
    }]);

directiveModule.directive('dmDropdownStaticInclude', ['$compile', function($compile) {
	return function(scope, element, attrs) {
		var template = attrs.dmDropdownStaticInclude;
		var contents = element.html(template).contents();
		$compile(contents)(scope);
	};
}]);

directiveModule.directive('ngDropdownMultiselectFilter', ['$filter', '$document', '$compile', '$parse','filterDebounce', '$timeout',function($filter, $document, $compile, $parse,filterDebounce,$timeout) {
	return {
		restrict: 'AE',
		scope: {
			selectedModel: '=',
			options: '=',
			extraSettings: '=',
			events: '=',
			searchFilter: '=?',
			translationTexts: '=',
			groupBy: '@',
			disabled: "="
		},
		template: function(element, attrs) {
			var checkboxes = attrs.checkboxes ? true : false;
			var groups = attrs.groupBy ? true : false;

			var template = '<div class="multiselect-parent btn-group dropdown-multiselect" ng-class="{open: open}">';
			template += '<button ng-disabled="disabled" type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
			template += '<ul ng-if="!closeThis" class="dropdown-menu dropdown-menu-form" ng-if="open" ng-style="{display: open ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'230px\', overflow: \'none\' }" >';
			template += '<li ng-if="settings.showCheckAll && settings.selectionLimit !== 1"><a ng-keydown="keyDownLink($event)" data-ng-click="selectAll()" tabindex="-1" id="selectAll"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
			template += '<li ng-if="settings.showUncheckAll"><a ng-keydown="keyDownLink($event)" data-ng-click="deselectAll();" tabindex="-1" id="deselectAll"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
			template += '<li ng-if="settings.selectByGroups && ((settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll)" class="divider"></li>';
			template += '<li ng-if="settings.selectByGroups && ((settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll)" class="divider"></li>';
			template += '<li ng-repeat="currentGroup in settings.selectByGroups track by $index" ng-click="selectCurrentGroup(currentGroup)"><a ng-class="{\'dropdown-selected-group\': selectedGroup === currentGroup}" tabindex="-1">{{::texts.selectGroup}} {{::getGroupLabel(currentGroup)}}</a></li>';
			template += '<li ng-if="settings.selectByGroups && settings.showEnableSearchButton" class="divider"></li>';
			template += '<li ng-if="settings.showEnableSearchButton && settings.enableSearch"><a ng-keydown="keyDownLink($event); keyDownToggleSearch();" ng-click="toggleSearch($event);" tabindex="-1">{{texts.disableSearch}}</a></li>';
			template += '<li ng-if="settings.showEnableSearchButton && !settings.enableSearch"><a ng-keydown="keyDownLink($event); keyDownToggleSearch();" ng-click="toggleSearch($event);" tabindex="-1">{{texts.enableSearch}}</a></li>';
			template += '<li ng-if="(settings.showCheckAll && settings.selectionLimit > 0) || settings.showUncheckAll || settings.showEnableSearchButton" class="divider"></li>';
			template += '<li ng-if="settings.enableSearch"><div class="dropdown-header"><textarea id="zsSearchInput" type="text" class="form-control searchField" ng-paste="paste($event)" ng-keydown="keyDownSearchDefault($event); keyDownSearch($event, input.searchFilter);" ng-keyup="searchChange()" ng-style="{width: \'100%\',height: \'30px\',resize:  \'none\',}" ng-model="input.searchFilter" placeholder="{{texts.searchPlaceholder}}" ng-model-options="{ debounce: 300 }"/></li>';
    //  template += '<li ng-if="settings.enableSearch"><div class="dropdown-header"><input id="zsSearchInput" type="text" class="form-control searchField"   ng-keydown="keyDownSearchDefault($event); keyDownSearch($event, input.searchFilter);"  ng-style="{width: \'100%\'}" ng-model="input.searchFilter" placeholder="{{texts.searchPlaceholder}}" ng-model-options="{ debounce: 1000 }" /></li>';

      template += '<li ng-if="settings.enableSearch" class="divider"></li>';

			if (groups) {


			//	template += '<li ng-repeat-start="option in orderedItems | filter:getFilter(input.searchFilter)" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupLabel(getPropertyForObject(option, settings.groupBy)) }}</li>';



        template += '<li ng-repeat-start="option in orderedItems | multFilterSpecial:input.searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupLabel(getPropertyForObject(option, settings.groupBy)) }}</li>';




        template += '<li ng-class="{\'active\': isChecked(getPropertyForObject(option,settings.idProp)) && settings.styleActive}" ng-repeat-end role="presentation">';
			} else {
			  // multFilterSpecial:(input.searchFilter)


				template += '<div style="height: 100%;overflow: auto;" id="zzz"><div vs-repeat="20" vs-scroll-parent="#zzz"><li ng-class="{\'active\': isChecked(getPropertyForObject(option,settings.idProp)) && settings.styleActive}" role="presentation" ng-repeat="option in options |multFilterSpecial:(input.searchFilter)" style="padding: 5px 20px;background-color: white">';
			}

			template += '<a ng-keydown="option.disabled || keyDownLink($event)" role="menuitem" class="option" tabindex="-1" ng-click="option.disabled || setSelectedItem(getPropertyForObject(option,settings.idProp), false, true)" ng-disabled="option.disabled">';

			if (checkboxes) {
				template += '<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> <span dm-dropdown-static-include="{{settings.template}}"></div></label></span></a>';
			} else {
				template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"> </span> <span dm-dropdown-static-include="{{settings.template}}"></span></a>';
			}

			template += '</li></div></div>';

			template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
			template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

			template += '</ul>';
			template += '</div>';

			return template;
		},
		link: function($scope, $element, $attrs) {
			var $dropdownTrigger = $element.children()[0];

			$scope.toggleDropdown = function() {
				if ($scope.open) {
					$scope.close()
				} else { $scope.open = true }
				if ($scope.settings.keyboardControls) {
					if ($scope.open) {
						if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {
							setTimeout(function() {
								angular.element($element)[0].querySelector('.searchField').focus();
							}, 0);
						} else {
							focusFirstOption();
						}
					}
				}
				if ($scope.settings.enableSearch) {

					if ($scope.open) {
						setTimeout(function () {
							angular.element($element)[0].querySelector('.searchField').focus();
						}, 0);
					}
				}else{
       //   angular.element("#zzz").css("margin-top","0");
         // angular.element("#zzz").css("height","100%");
        }
			};

			$scope.checkboxClick = function($event, id) {
				$scope.setSelectedItem(id, false, true);
				$event.stopImmediatePropagation();
			};

			$scope.externalEvents = {
				onItemSelect: angular.noop,
				onItemDeselect: angular.noop,
				onSelectAll: angular.noop,
				onDeselectAll: angular.noop,
				onInitDone: angular.noop,
				onMaxSelectionReached: angular.noop,
				onSelectionChanged: angular.noop,
				onClose: angular.noop
			};

			$scope.settings = {
				dynamicTitle: true,
				scrollable: false,
				scrollableHeight: '300px',
				closeOnBlur: true,
				displayProp: 'label',
				idProp: 'id',
				externalIdProp: 'id',
				enableSearch: false,
				selectionLimit: 0,
				showCheckAll: true,
				showUncheckAll: true,
				showEnableSearchButton: false,
				closeOnSelect: false,
				buttonClasses: 'btn btn-default',
				closeOnDeselect: false,
				groupBy: $attrs.groupBy || undefined,
				groupByTextProvider: null,
				smartButtonMaxItems: 0,
				smartButtonTextConverter: angular.noop,
				styleActive: false,
				keyboardControls: false,
				template: '{{getPropertyForObject(option, settings.displayProp)}}',
				searchField: '$',
				showAllSelectedText: false
			};

			$scope.texts = {
				checkAll: 'Check All',
				uncheckAll: 'Uncheck All',
				selectionCount: 'checked',
				selectionOf: '/',
				searchPlaceholder: 'Search...',
				buttonDefaultText: 'Select',
				dynamicButtonTextSuffix: 'checked',
				disableSearch: 'Disable search',
				enableSearch: 'Enable search',
				selectGroup: 'Select all:',
				allSelectedText: 'All'
			};

			$scope.input = {
				searchFilter: $scope.searchFilter || ''
			};
      $scope.$watch('input.searchFilter', function(newValue) {
       $scope.input.searchFilter = dealWithInputString(newValue);
        // 空格换行改成, 换行改成, 最后逗号去掉,最后空格去掉,最后逗号去掉
      });
			if (angular.isDefined($scope.settings.groupBy)) {
				$scope.$watch('options', function(newValue) {
					if (angular.isDefined(newValue)) {
						$scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
					}
				});
			}

			$scope.$watch('selectedModel', function(newValue) {
				if (!Array.isArray(newValue)) {
					$scope.singleSelection = true;
				} else {
					$scope.singleSelection = false;
				}
			});

			$scope.close = function() {
				$scope.open = false;
				$scope.externalEvents.onClose();
			}

			$scope.selectCurrentGroup = function(currentGroup) {
				$scope.selectedModel.splice(0, $scope.selectedModel.length);
				if ($scope.orderedItems) {
					$scope.orderedItems.forEach(function(item) {
						if (item[$scope.groupBy] === currentGroup) {
							$scope.setSelectedItem($scope.getPropertyForObject(item, $scope.settings.idProp), false, false)
						}
					});
				}
				$scope.externalEvents.onSelectionChanged();
			};

			angular.extend($scope.settings, $scope.extraSettings || []);
			angular.extend($scope.externalEvents, $scope.events || []);
			angular.extend($scope.texts, $scope.translationTexts);

			$scope.singleSelection = $scope.settings.selectionLimit === 1;

			function getFindObj(id) {
				var findObj = {};

				if ($scope.settings.externalIdProp === '') {
					findObj[$scope.settings.idProp] = id;
				} else {
					findObj[$scope.settings.externalIdProp] = id;
				}

				return findObj;
			}

			function clearObject(object) {
				for (var prop in object) {
					delete object[prop];
				}
			}

			if ($scope.singleSelection) {
				if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
					clearObject($scope.selectedModel);
				}
			}

			if ($scope.settings.closeOnBlur) {
				$document.on('click', function(e) {
					if ($scope.open) {
						var target = e.target.parentElement;
						var parentFound = false;

						while (angular.isDefined(target) && target !== null && !parentFound) {
							if (!!target.className.split && contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
								if (target === $dropdownTrigger) {
									parentFound = true;
								}
							}
							target = target.parentElement;
						}

						if (!parentFound) {
							$scope.$apply(function() {
								$scope.close();
							});
						}
					}
				});
			}

			$scope.getGroupLabel = function(groupValue) {
				if ($scope.settings.groupByTextProvider !== null) {
					return $scope.settings.groupByTextProvider(groupValue);
				}

				return groupValue;
			};

			function textWidth(text) {
				var $btn = $element.find('button');
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				ctx.font = $btn.css('font-size') + $btn.css('font-family');
				// http://stackoverflow.com/questions/38823353/chrome-canvas-2d-context-measuretext-giving-me-weird-results
				ctx.originalFont = $btn.css('font-size') + $btn.css('font-family');
				ctx.fillStyle = '#000000';
				return ctx.measureText(text).width;
			}

			$scope.getButtonText = function() {
				if ($scope.settings.dynamicTitle && $scope.selectedModel && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && Object.keys($scope.selectedModel).length > 0))) {
					if ($scope.settings.smartButtonMaxItems > 0) {

						var paddingWidth = 12 * 2,
								borderWidth = 1 * 2,
								dropdownIconWidth = 8;
						var widthLimit = $element[0].offsetWidth - paddingWidth - borderWidth - dropdownIconWidth;

						var itemsText = [];

						angular.forEach($scope.options, function(optionItem) {
							if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
								var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
								var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

								itemsText.push(converterResponse ? converterResponse : displayText);
							}
						});

						if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
							itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
							itemsText.push('...');
						}

						var result = itemsText.join(', ');
						var index = result.length - 4;
						if ($element[0].offsetWidth === 0)
							return result;
						while (textWidth(result) > widthLimit && index > 0) {
							if (itemsText[itemsText.length - 1] !== "...") {
								itemsText.push('...');
								result = result + "...";
							}
							result = result.slice(0, index) + result.slice(index + 1);
							index--;
						}

						return result;
					} else {
						var totalSelected;

						if ($scope.singleSelection) {
							totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
						} else {
							totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
						}

						if (totalSelected === 0) {
							return $scope.texts.buttonDefaultText;
						}

						if ($scope.settings.showAllSelectedText && totalSelected === $scope.options.length) {
							return $scope.texts.allSelectedText;
						}

						return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
					}
				} else {
					return $scope.texts.buttonDefaultText;
				}
			};

			$scope.getPropertyForObject = function(object, property) {
				if (angular.isDefined(object) && object.hasOwnProperty(property)) {
					return object[property];
				}

				return undefined;
			};
			var selectSearchKeyList = function(){
			//  debugger;
        $scope.selectedModel.splice(0, $scope.selectedModel.length);
        $scope.selectedGroup = null;
       var searchResult = $filter('multFilterSpecial')($scope.options,  angular.element("#zsSearchInput").val());
        angular.forEach(searchResult, function(value) {
          $scope.setSelectedItemNoEvent(value[$scope.settings.idProp]);
        });
       // $scope.selectedModel = $scope.selectedGroup;
      }


      $scope.searchChange = function(ele){

        filterDebounce(function(){

       //   debugger
        //  $scope.selectAll();
          //   $scope.selectedModel = $filter('multFilterSpecial')($scope.selectedModel, angular.element("#zsSearchInput").val());

          selectSearchKeyList();

        },1000);

      }
			$scope.selectAll = function() {

				var searchResult;
				$scope.deselectAll(true);
				$scope.externalEvents.onSelectAll();

			//	searchResult = $filter('filter')($scope.options, $scope.getFilter($scope.input.searchFilter));
         searchResult = $filter('multFilterSpecial')($scope.options,$scope.input.searchFilter);


        console.log($scope.input.searchFilter)
				angular.forEach(searchResult, function(value) {
					$scope.setSelectedItem(value[$scope.settings.idProp], true, false);
				});
        console.log($scope.selectedModel);
				$scope.externalEvents.onSelectionChanged();
				$scope.selectedGroup = null;
			};

			$scope.deselectAll = function(dontSendEvent) {
				dontSendEvent = dontSendEvent || false;

				if (!dontSendEvent) {
					$scope.externalEvents.onDeselectAll();
				}

				if ($scope.singleSelection) {
					clearObject($scope.selectedModel);
				} else {
					$scope.selectedModel.splice(0, $scope.selectedModel.length);
				}
				if (!dontSendEvent) {
					$scope.externalEvents.onSelectionChanged();
				}
				$scope.selectedGroup = null;
			};

			$scope.setSelectedItem = function(id, dontRemove, fireSelectionChange) {
				var findObj = getFindObj(id);
				var finalObj = null;

				if ($scope.settings.externalIdProp === '') {
					finalObj = find($scope.options, findObj);
				} else {
					finalObj = findObj;
				}

				if ($scope.singleSelection) {
					clearObject($scope.selectedModel);
					angular.extend($scope.selectedModel, finalObj);
					if (fireSelectionChange) {
						$scope.externalEvents.onItemSelect(finalObj);
					}
					if ($scope.settings.closeOnSelect || $scope.settings.closeOnDeselect) $scope.close();
				} else {
					dontRemove = dontRemove || false;

					var exists = findIndex($scope.selectedModel, findObj) !== -1;

					if (!dontRemove && exists) {
						$scope.selectedModel.splice(findIndex($scope.selectedModel, findObj), 1);
						$scope.externalEvents.onItemDeselect(findObj);
						if ($scope.settings.closeOnDeselect) $scope.close();
					} else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
						$scope.selectedModel.push(finalObj);
						if (fireSelectionChange) {
							$scope.externalEvents.onItemSelect(finalObj);
						}
						if ($scope.settings.closeOnSelect) $scope.close();
						if ($scope.settings.selectionLimit > 0 && $scope.selectedModel.length === $scope.settings.selectionLimit) {
							$scope.externalEvents.onMaxSelectionReached();
						}
					}
				}
				if (fireSelectionChange) {
					$scope.externalEvents.onSelectionChanged();
				}
				$scope.selectedGroup = null;
			};
      $scope.setSelectedItemNoEvent = function(id) {
        var findObj = getFindObj(id);
        var finalObj = null;

        if ($scope.settings.externalIdProp === '') {
          finalObj = find($scope.options, findObj);
        } else {
          finalObj = findObj;
        }

          var exists = findIndex($scope.selectedModel, findObj) !== -1;

          if ( exists) {
            $scope.selectedModel.splice(findIndex($scope.selectedModel, findObj), 1);

          } else {
            $scope.selectedModel.push(finalObj);
          }
        $scope.selectedGroup = null;
      };

			$scope.isChecked = function(id) {
				if ($scope.singleSelection) {
					if ($scope.settings.externalIdProp === '') {
						return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
					}
					return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.externalIdProp]) && $scope.selectedModel[$scope.settings.externalIdProp] === getFindObj(id)[$scope.settings.externalIdProp];
				}

				return findIndex($scope.selectedModel, getFindObj(id)) !== -1;
			};

			$scope.externalEvents.onInitDone();

			$scope.keyDownLink = function(event) {
				var sourceScope = angular.element(event.target).scope();
				var nextOption;
				var parent = event.target.parentNode;
				if (!$scope.settings.keyboardControls) {
					return;
				}
				if (event.keyCode === 13 || event.keyCode === 32) { // enter
					event.preventDefault();
					if (!!sourceScope.option) {
						$scope.setSelectedItem($scope.getPropertyForObject(sourceScope.option, $scope.settings.idProp), false, true);
					} else if (event.target.id === 'deselectAll') {
						$scope.deselectAll();
					} else if (event.target.id === 'selectAll') {
						$scope.selectAll();
					}
				} else if (event.keyCode === 38) { // up arrow
					event.preventDefault();
					if (!!parent.previousElementSibling) {
						nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
					}
					while (!nextOption && !!parent) {
						parent = parent.previousElementSibling;
						if (!!parent) {
							nextOption = parent.querySelector('a') || parent.querySelector('input');
						}
					}
					if (!!nextOption) {
						nextOption.focus();
					}
				} else if (event.keyCode === 40) { // down arrow
					event.preventDefault();
					if (!!parent.nextElementSibling) {
						nextOption = parent.nextElementSibling.querySelector('a') || parent.nextElementSibling.querySelector('input');
					}
					while (!nextOption && !!parent) {
						parent = parent.nextElementSibling;
						if (!!parent) {
							nextOption = parent.querySelector('a') || parent.querySelector('input');
						}
					}
					if (!!nextOption) {
						nextOption.focus();
					}
				} else if (event.keyCode === 27) {
					event.preventDefault();

					$scope.toggleDropdown();
				}
			};
      $scope.paste = function(event){
      //  event.preventdefault()
     //    debugger;
     //    return;
     //    event.stopPropagation();
     //
     //    var pasteContent = event.originalEvent.clipboardData.getData('text/plain');
     //    var changeToText = pasteContent.replace(/\n/g,',').replace(/,$/gi,'');
     //  //  $("#zsSearchInput").val(changeToText)
     //  //  event.preventdefault()
     // //   $("#zsSearchInput").val("")
     //    $scope.input.searchFilter=changeToText;
     //    return;
     //    $timeout(function(){
     //
     //       $("#zsSearchInput").val(changeToText)
     //     // $scope.input.searchFilter=changeToText;
     //      $("#zsSearchInput").blur()
     //      document.getElementById("zsSearchInput").scrollTop = 0;
     //      console.log(changeToText)
     //      // console.log(changeToText)
     //    },2000);
      };
			$scope.keyDownSearchDefault = function(event) {
				var parent = event.target.parentNode.parentNode;
				var nextOption;
				if (!$scope.settings.keyboardControls) {
					return;
				}
				if (event.keyCode === 9 || event.keyCode === 40) { //tab
					event.preventDefault();
					focusFirstOption();
				} else if (event.keyCode === 38) {
					event.preventDefault();
					if (!!parent.previousElementSibling) {
						nextOption = parent.previousElementSibling.querySelector('a') || parent.previousElementSibling.querySelector('input');
					}
					while (!nextOption && !!parent) {
						parent = parent.previousElementSibling;
						if (!!parent) {
							nextOption = parent.querySelector('a') || parent.querySelector('input');
						}
					}
					if (!!nextOption) {
						nextOption.focus();
					}
				} else if (event.keyCode === 27) {
					event.preventDefault();

					$scope.toggleDropdown();
				}
			};

			$scope.keyDownSearch = function(event, searchFilter) {
				var searchResult;
				if (!$scope.settings.keyboardControls) {
					return;
				}
				if (event.keyCode === 13) {
					if ($scope.settings.selectionLimit === 1 && $scope.settings.enableSearch) {

					  //searchResult = $filter('filter')($scope.options, $scope.getFilter(searchFilter));
            searchResult = $filter('multFilterSpecial')($scope.options,  searchFilter);

						if (searchResult.length === 1) {
							$scope.setSelectedItem($scope.getPropertyForObject(searchResult[0], $scope.settings.idProp), false, true);
						}
					} else if ($scope.settings.enableSearch) {
						$scope.selectAll();
					}
				}
			};

			$scope.getFilter = function(searchFilter) {
				var filter = {};
				filter[$scope.settings.searchField] = searchFilter;
				return filter;
			};

			$scope.toggleSearch = function($event) {
				if ($event) {
					$event.stopPropagation();
				}
				$scope.settings.enableSearch = !$scope.settings.enableSearch;
				if (!$scope.settings.enableSearch) {
					$scope.input.searchFilter = '';
				}
			};

			$scope.keyDownToggleSearch = function() {
				if (!$scope.settings.keyboardControls) {
					return;
				}
				if (event.keyCode === 13) {
					$scope.toggleSearch();
					if ($scope.settings.enableSearch) {
						setTimeout(
							function() {
								angular.element($element)[0].querySelector('.searchField').focus();
							}, 0
						);
					} else {
						focusFirstOption();
					}
				}
			};

			function focusFirstOption() {
				setTimeout(function() {
					var elementToFocus = angular.element($element)[0].querySelector('.option');
					if (angular.isDefined(elementToFocus) && elementToFocus != null) {
						elementToFocus.focus();
					}
				}, 0);
			}
		}
	};
}]);

function contains(collection, target) {
	var containsTarget = false;
	collection.some(function(object) {
		if (object === target) {
			containsTarget = true;
			return true;
		}
	});
	return containsTarget;
}

function find(collection, properties) {
	var target;

	collection.some(function(object) {
		var hasAllSameProperties = true;
		Object.keys(properties).forEach(function(key) {
			if (object[key] !== properties[key]) {
				hasAllSameProperties = false;
			}
		});
		if (hasAllSameProperties) {
			target = object;
			return true
		}
	});

	return target;
}

function findIndex(collection, properties) {
	var index = -1;
	var counter = -1;

	collection.some(function(object) {
		var hasAllSameProperties = true;
		counter += 1;
		Object.keys(properties).forEach(function(key) {
			if (object[key] !== properties[key]) {
				hasAllSameProperties = false;
			}
		});
		if (hasAllSameProperties) {
			index = counter;
			return true
		}
	});

	return index;
}
})(angular);
