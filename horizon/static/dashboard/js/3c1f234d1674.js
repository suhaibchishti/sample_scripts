$(function(){"use strict";var plus="<i class='fa fa-plus-circle'></i>";if(typeof window.murano==="undefined"){window.murano={};}
if(!window.murano.bind_add_item_handlers){window.murano.bind_add_item_handlers=true;horizon.modals.addModalInitFunction(initPlusButton);initPlusButton($('div.static_page form'));}
function initPlusButton(el){var $selects=$(el).find('select[data-add-item-url]');$selects.each(function(){var $this=$(this);var urls,link,$choices;try{urls=$.parseJSON($this.attr("data-add-item-url"));}catch(err){if(window.console){window.console.log(err);}}
if(urls&&urls[0].length){if(urls.length===1){link=$this.next().find('a');link.html(plus);link.attr('href',urls[0][1]);}else{link=$this.next().find('a').toggleClass('dropdown-toggle');link.html(plus);link.attr('href','#');link.attr('data-toggle','dropdown');link.removeClass('ajax-add ajax-modal');$choices=$("<ul class='dropdown-menu murano-dropdown-menu' role='menu'></ul>");$(urls).each(function(i,url){$choices.append($("<li><a href='"+url[1]+"' data-add-to-field='"+
$this.attr("id")+"' class='ajax-add ajax-modal'>"+url[0]+"</a></li>"));});$this.next('span').append($choices);}}
if($this.hasClass('murano_add_select')){if(this.options.length===1){$this.hide();$this.next('span').removeClass('input-group-btn').find('i').text(' Add Application');}
$this.change(function(){if(!$this.is(':visible')&&this.options.length>1){$this.show();$this.next('span').addClass('input-group-btn').find('i').text('');$this.val($(this.options[1]).val());}});}});}});$(function(){"use strict";horizon.tabs.addTabLoadFunction(initServicesTab);initServicesTab($('.tab-content .tab-pane.active'));function initServicesTab($tab){var $dropArea=$tab.find('.drop_component');var draggedAppUrl=null;var firstDropTarget=null;function bindAppTileHandlers(){$('.draggable_app').each(function(){$(this).on('dragstart',function(ev){ev.originalEvent.dataTransfer.effectAllowed='copy';draggedAppUrl=$(this).find('input[type="hidden"]').val();ev.originalEvent.dataTransfer.setData('text/uri-list',draggedAppUrl);}).on('dragend',function(){$dropArea.removeClass('over');});});}
$dropArea.on('dragover',function(ev){ev.preventDefault();ev.originalEvent.dataTransfer.dropEffect='copy';return false;}).on('dragenter',function(ev){$dropArea.addClass('over');firstDropTarget=ev.target;}).on('dragleave',function(ev){if(firstDropTarget===ev.target){$dropArea.removeClass('over');}}).on('drop',function(ev){ev.preventDefault();horizon.modals.loadModal(draggedAppUrl);return false;});var packages=$.parseJSON($('#apps_carousel_contents').val());function subdivide(array,numOfItems){var chunks=[];var seq=array;var head=seq.slice(0,numOfItems);var tail=seq.slice(numOfItems);while(tail.length){chunks.push(head);head=tail.slice(0,numOfItems);tail=tail.slice(numOfItems);}
chunks.push(head);return chunks;}
var $carouselInner=$tab.find('.carousel-inner');var $carousel=$('#apps_carousel');var $filter=$('#envAppsFilter').find('input');var $noAppMsg=$('#no_apps_found_message');var category='All';var ALL_CATEGORY='All';var filterValue='';var ENTER_KEYCODE=13;var tileTemplate,environmentId;var $appTitleSmall=$('#app_tile_small');if($appTitleSmall.length>0){tileTemplate=Hogan.compile($appTitleSmall.html());}
if($('#environmentId').length>0){environmentId=$('#environmentId').val();}
function fillCarousel(apps){var i=apps.length;while(i--){if(TENANT_ID!==apps[i].owner_id&&apps[i].is_public===false){apps.splice(i,1);}}
if(apps.length){$dropArea.show();$noAppMsg.hide();if($carousel.css('display')==='none'){$carousel.show();}
subdivide(apps,6).forEach(function(chunk,index){var $item=$('<div class="item"></div>');var $row=$('<div class="row"></div>');if(index===0){$item.addClass('active');}
$item.appendTo($row);chunk.forEach(function(pkg){var html=tileTemplate.render({app_name:pkg.name,environment_id:environmentId,app_id:pkg.id});if(TENANT_ID===pkg.owner_id){html=$(html).find('img.ribbon').remove().end();}
$(html).appendTo($item);});$item.appendTo($carouselInner);});$('div.carousel-control').removeClass('item');bindAppTileHandlers();}else{if($('#no_apps_in_catalog_message').length===0){$noAppMsg.show();}
$carousel.hide();$dropArea.hide();}}
if(packages){fillCarousel(packages);}
$carousel.carousel({interval:false});function refillCarousel(){$carouselInner.empty();if(category===ALL_CATEGORY&&filterValue===''){fillCarousel(packages);}else{var filterRegexp=new RegExp(filterValue,'i');var filterRegexpExact=new RegExp('\\b'+filterValue+'\\b','i');fillCarousel(packages.filter(function(pkg){var categorySatisfied=true;var filterSatisfied=true;if(category!==ALL_CATEGORY){categorySatisfied=pkg.categories.indexOf(category)>-1;}
if(filterValue!==''){filterSatisfied=pkg.name.match(filterRegexp);filterSatisfied=filterSatisfied||pkg.description.match(filterRegexp);filterSatisfied=filterSatisfied||pkg.tags.some(function(tag){return tag.match(filterRegexpExact);});}
return categorySatisfied&&filterSatisfied;}));}}
$('#envAppsCategory').on('click','a',function(env){var $category=$(this);category=$category.attr('data-category-name');$('#envAppsCategoryName').text($category.text());refillCarousel();env.preventDefault();});$filter.keypress(function(ev){if(ev.which===ENTER_KEYCODE){filterValue=$filter.val();refillCarousel();ev.preventDefault();}});$('.may_overflow').each(function(){$(this).bind('mouseenter',function(){var $this=$(this);if(this.offsetWidth<this.scrollWidth&&!$this.attr('title')){$this.attr('title',$this.text());}});});function hideSpinner(){horizon.modals.spinner.modal('hide');}
function handleError(){hideSpinner();horizon.alert('error',gettext('Unable to run action.'));}
bindActionHandlers($tab);var $table=$('table.datatable');$table.on('update',function(){bindActionHandlers($table);});function bindActionHandlers($parent){$parent.find('.murano_action').off('click').on('click',function(event){var $this=$(this);var $form=$this.closest('.table_wrapper > form');var startUrl=$this.attr('href');var resultUrl=null;var ERRDATA='error';var data=null;function doRequest(url){var requestData;$.ajax({type:'GET',url:url,async:false,error:function(){handleError();requestData=ERRDATA;},success:function(newData){requestData=newData;}});return requestData;}
horizon.modals.modal_spinner(gettext("Waiting for a result"));var button='<div class="modal-close"'+'><button class="btn btn-sm btn-danger" data-placement="right"'+' data-original-title="Action result won\'t be available">Stop Waiting</button></div>';var modalContent=horizon.modals.spinner.find(".modal-content");var intervalId;modalContent.append(button);$('.modal-close button').tooltip();$('.modal-close button').on("click",function(){window.clearInterval(intervalId);document.location=$form.attr('action');});if(startUrl){$.ajax({type:'POST',url:startUrl,data:$form.serialize(),async:false,success:function(successData){resultUrl=successData&&successData.url;},error:handleError});if(resultUrl){intervalId=window.setInterval(function(){data=doRequest(resultUrl+'poll');if(!$.isEmptyObject(data)){window.clearInterval(intervalId);if(data!==ERRDATA){if(data.isException){handleError();document.location=resultUrl;}else if(typeof data.result!=="undefined"&&data.result===null){hideSpinner();document.location=$form.attr('action');}else{hideSpinner();document.location=resultUrl;}}}},1000);}}
event.preventDefault();});}}});$(function(){"use strict";$('table#environments .add_env a').on('click',createEnv);$('table#environments .table_actions a.add_env').on('click',createEnv);function createEnv(ev){function showSpinner(){horizon.modals.modal_spinner(gettext("Working"));}
function hideSpinner(){horizon.modals.spinner.modal('hide');}
var $tbody=$('table tbody');var CREATE_URL=$(this).attr('href');$.ajax({type:'GET',url:CREATE_URL,async:false,beforeSend:showSpinner,complete:hideSpinner,success:drawWorkflowInline});function drawWorkflowInline(data,validationFailed){var $form=$(data).find('form');var $name=$form.find('div.form-group');$name.addClass("col-md-6");if(validationFailed){$tbody.find('tr.new_env').remove();}
var $newEnvTr=$('<tr class="new_env">'+'<td id="input_create_env" class="normal_column row" colspan="2"></td>'+'<td class="normal_column">New</td>'+'<td class="actions_column">'+'<div class="btn-group">'+'<button id="confirm_create_env" class="btn btn-primary">Create</button>'+'<button id="cancel_create_env" class="btn btn-default">Cancel</button>'+'</div></td></tr>');$name.appendTo($newEnvTr.find('td#input_create_env'));var $emptyRow=$tbody.find('tr.empty');$emptyRow.hide();$newEnvTr.prependTo($tbody);$name.find('input#id_name').focus();$('button#cancel_create_env').on('click',function(ev){$newEnvTr.remove();$emptyRow.show();ev.preventDefault();});$('button#confirm_create_env').on('click',function(ev){$name.appendTo($form);$.ajax({type:'POST',url:CREATE_URL,async:false,data:$form.serialize(),beforeSend:showSpinner,error:function(){$newEnvTr.remove();hideSpinner();horizon.alert('error','There was an error submitting the form. Please try again.');},success:function(data,status,xhr){if(data===''){var redirUrl=xhr.getResponseHeader('X-Horizon-Location');$newEnvTr.remove();window.location.replace(redirUrl);}else{hideSpinner();drawWorkflowInline(data,true);}}});ev.preventDefault();});}
ev.preventDefault();}});$(function(){"use strict";$('table#environments .add_env a').on('click',createEnv);$('table#environments .table_actions a.add_env').on('click',createEnv);function createEnv(ev){function showSpinner(){horizon.modals.modal_spinner(gettext("Working"));}
function hideSpinner(){horizon.modals.spinner.modal('hide');}
var $tbody=$('table tbody');var CREATE_URL=$(this).attr('href');$.ajax({type:'GET',url:CREATE_URL,async:false,beforeSend:showSpinner,complete:hideSpinner,success:drawWorkflowInline});function drawWorkflowInline(data,validationFailed){var $form=$(data).find('form');var $name=$form.find('div.form-group');$name.addClass("col-md-6");if(validationFailed){$tbody.find('tr.new_env').remove();}
var $newEnvTr=$('<tr class="new_env">'+'<td id="input_create_env" class="normal_column row" colspan="2"></td>'+'<td class="normal_column">New</td>'+'<td class="actions_column">'+'<div class="btn-group">'+'<button id="confirm_create_env" class="btn btn-primary">Create</button>'+'<button id="cancel_create_env" class="btn btn-default">Cancel</button>'+'</div></td></tr>');$name.appendTo($newEnvTr.find('td#input_create_env'));var $emptyRow=$tbody.find('tr.empty');$emptyRow.hide();$newEnvTr.prependTo($tbody);$name.find('input#id_name').focus();$('button#cancel_create_env').on('click',function(ev){$newEnvTr.remove();$emptyRow.show();ev.preventDefault();});$('button#confirm_create_env').on('click',function(ev){$name.appendTo($form);$.ajax({type:'POST',url:CREATE_URL,async:false,data:$form.serialize(),beforeSend:showSpinner,error:function(){$newEnvTr.remove();hideSpinner();horizon.alert('error','There was an error submitting the form. Please try again.');},success:function(data,status,xhr){if(data===''){var redirUrl=xhr.getResponseHeader('X-Horizon-Location');$newEnvTr.remove();window.location.replace(redirUrl);}else{hideSpinner();drawWorkflowInline(data,true);}}});ev.preventDefault();});}
ev.preventDefault();}});$(function(){"use strict";function checkPreconfiguredAd(){var checked=$("input[id*='externalAD']").prop('checked');if(checked===true){$("select[id*='-domain']").attr("disabled","disabled");$("label[for*='domainAdminUserName']").parent().css({'display':'inline-block'});$("label[for*='domainAdminPassword']").parent().css({'display':'inline-block'});}
if(checked===false){$("select[id*='-domain']").removeAttr("disabled");$("label[for*='domainAdminUserName']").parent().css({'display':'none'});$("label[for*='domainAdminPassword']").parent().css({'display':'none'});}}
$("input[id*='externalAD']").change(checkPreconfiguredAd);checkPreconfiguredAd();});$(function(){"use strict";horizon.tabs._init_load_functions.push(loadMuranoTopology);function loadMuranoTopology(){var muranoContainer="#murano_application_topology";if($(muranoContainer).length===0){return;}
var ajaxUrl,force,node,link,needsUpdate,nodes,links,inProgress;function update(){node=node.data(nodes,function(d){return d.id;});link=link.data(links);var nodeEnter=node.enter().append("g").attr("class","node").attr("node_name",function(d){return d.name;}).attr("node_id",function(d){return d.id;}).call(force.drag);nodeEnter.append("image").attr("xlink:href",function(d){return d.image;}).attr("id",function(d){return"image_"+d.id;}).attr("x",function(d){return d.image_x;}).attr("y",function(d){return d.image_y;}).attr("width",function(d){return d.image_size;}).attr("height",function(d){return d.image_size;}).attr("clip-path","url(#clipCircle)");node.exit().remove();link.enter().insert("path","g.node").attr("class",function(d){return"link "+d.link_type;});link.exit().remove();node.on("mouseover",function(d){$("#info_box").html(d.info_box);});node.on("mouseout",function(){$("#info_box").html('');});force.start();}
function drawLink(d){return"M"+d.source.x+","+d.source.y+"L"+d.target.x+","+d.target.y;}
function tick(){link.attr('d',drawLink).style('stroke-width',3).attr('marker-end',"url(#end)");node.attr("transform",function(d){return"translate("+d.x+","+d.y+")";});}
function setInProgress(stack,innerNodes){if(stack.in_progress===true){inProgress=true;}
for(var i=0;i<innerNodes.length;i++){var d=innerNodes[i];if(d.in_progress===true){inProgress=true;return false;}}}
function findNode(id){for(var i=0;i<nodes.length;i++){if(nodes[i].id===id){return nodes[i];}}}
function findNodeIndex(id){for(var i=0;i<nodes.length;i++){if(nodes[i].id===id){return i;}}}
function addNode(innerNode){nodes.push(innerNode);needsUpdate=true;}
function removeNode(id){var i=0;var n=findNode(id);while(i<links.length){if(links[i].source===n||links[i].target===n){links.splice(i,1);}else{i++;}}
nodes.splice(findNodeIndex(id),1);needsUpdate=true;}
function removeNodes(oldNodes,newNodes){for(var i=0;i<oldNodes.length;i++){var isRemoveNode=true;for(var j=0;j<newNodes.length;j++){if(oldNodes[i].id===newNodes[j].id){isRemoveNode=false;break;}}
if(isRemoveNode===true){removeNode(oldNodes[i].id);}}}
function buildNodeLinks(innerNode){for(var j=0;j<innerNode.required_by.length;j++){var pushLink=true;var targetIdx='';var sourceIdx=findNodeIndex(innerNode.id);try{targetIdx=findNodeIndex(innerNode.required_by[j]);}catch(err){if(window.console){window.console.log(err);}
pushLink=false;}
for(var lidx=0;lidx<links.length;lidx++){if(links[lidx].source===sourceIdx&&links[lidx].target===targetIdx){pushLink=false;break;}}
if(pushLink===true&&(sourceIdx&&targetIdx)){links.push({'target':sourceIdx,'source':targetIdx,'value':1,'link_type':innerNode.link_type});}}}
function buildReverseLinks(innerNode){for(var i=0;i<nodes.length;i++){if(nodes[i].required_by){for(var j=0;j<nodes[i].required_by.length;j++){var dependency=nodes[i].required_by[j];if(innerNode.id===dependency){links.push({'target':findNodeIndex(nodes[i].id),'source':findNodeIndex(innerNode.id),'value':1,'link_type':nodes[i].link_type});}}}}}
function buildLinks(){for(var i=0;i<nodes.length;i++){buildNodeLinks(nodes[i]);buildReverseLinks(nodes[i]);}}
function ajaxPoll(pollTime){setTimeout(function(){$.getJSON(ajaxUrl,function(json){$("#d3_data").attr("data-d3_data",JSON.stringify(json));$("#stack_box").html(json.environment.info_box);setInProgress(json.environment,json.nodes);needsUpdate=false;removeNodes(nodes,json.nodes);json.nodes.forEach(function(d){var currentNode=findNode(d.id);if(currentNode){currentNode.status=d.status;if(currentNode.image!==d.image){currentNode.image=d.image;var thisImage=d3.select("#image_"+currentNode.id);thisImage.transition().attr("x",function(dImage){return dImage.image_x+5;}).duration(100).transition().attr("x",function(dImage){return dImage.image_x-5;}).duration(100).transition().attr("x",function(dImage){return dImage.image_x+5;}).duration(100).transition().attr("x",function(dImage){return dImage.image_x-5;}).duration(100).transition().attr("xlink:href",d.image).transition().attr("x",function(dImage){return dImage.image_x;}).duration(100).ease("bounce");}
currentNode.info_box=d.info_box;}else{addNode(d);buildLinks();}});if(needsUpdate===true){update();}});if(inProgress===false){pollTime=30000;}else{pollTime=3000;}
ajaxPoll(pollTime);},pollTime);}
if($(muranoContainer).length){var width=$(muranoContainer).width();var height=1040;var environmentId=$("#environment_id").data("environment_id");var graph=$("#d3_data").data("d3_data");var svg=d3.select(muranoContainer).append("svg").attr("width",width).attr("height",height);ajaxUrl='/murano/'+environmentId+'/services/get_d3_data';force=d3.layout.force().nodes(graph.nodes).links([]).gravity(0.25).charge(-3000).linkDistance(100).size([width,height]).on("tick",tick);node=svg.selectAll(".node");link=svg.selectAll(".link");needsUpdate=false;nodes=force.nodes();links=force.links();svg.append("svg:clipPath").attr("id","clipCircle").append("svg:circle").attr("cursor","pointer").attr("r","38px");svg.append("svg:defs").selectAll("marker").data(["end"]).enter().append("svg:marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",25).attr("refY",0).attr("fill","#999").attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("svg:path").attr("d","M0,-3L10,0L0,3");buildLinks();update();$("#stack_box").html(graph.environment.info_box);inProgress=false;setInProgress(graph.environment,node);var pollTime=0;if(inProgress===true){pollTime=3000;}else{pollTime=30000;}
ajaxPoll(pollTime);}}});var reloadCalled=false;$(function(){"use strict";$("table#services.datatable").on("update",function(){var $rowsToUpdate=$(this).find('tr.status_unknown.ajax-update');if($rowsToUpdate.length===0){if(reloadCalled===false){reloadCalled=true;location.reload(true);}}});});$(function(){"use strict";horizon.modals.loadModal=function(url,updateFieldId){if(horizon.modals.request&&typeof horizon.modals.request.abort!=="undefined"){horizon.modals.request.abort();}
horizon.modals.request=$.ajax(url,{beforeSend:function(){horizon.modals.modal_spinner(gettext("Loading"));},complete:function(){horizon.modals.request=null;horizon.modals.spinner.modal('hide');},error:function(jqXHR){if(jqXHR.status===401){var redirUrl=jqXHR.getResponseHeader("X-Horizon-Location");if(redirUrl){location.href=redirUrl;}else{location.reload(true);}}else{if(!horizon.ajax.get_messages(jqXHR)){horizon.alert("danger",gettext("An error occurred. Please try again later."));}}},success:function(data,textStatus,jqXHR){var formUpdateFieldId=updateFieldId;var modal,form;modal=horizon.modals.success(data,textStatus,jqXHR);if(formUpdateFieldId){form=modal.find("form");if(form.length){form.attr("data-add-to-field",formUpdateFieldId);}}}});};});$(function(){"use strict";function checkMixedMode(){var checked=$("input[id*='mixedModeAuth']").prop('checked');if(checked===true){$("label[for*='saPassword']").parent().css({'display':'inline-block'});}else if(checked===false){$("label[for*='saPassword']").parent().css({'display':'none'});}}
$("input[id*='mixedModeAuth']").change(checkMixedMode);checkMixedMode();});(function(){'use strict';angular.module('horizon.app.core.openstack-service-api').factory('horizon.app.core.openstack-service-api.murano',muranoAPI);muranoAPI.$inject=['horizon.framework.util.http.service','horizon.framework.widgets.toast.service'];function muranoAPI(apiService,toastService){var service={getPackages:getPackages};return service;function getPackages(params){var config=params?{'params':params}:{};return apiService.get('/api/murano/packages/',config).error(function(){toastService.add('error',gettext('Unable to retrieve the packages.'));});}}})();$(function(){"use strict";function mainCheck(div,parameter1,parameter2,text){var msg="<div class='alert alert-message alert-danger'>"+gettext(text)+'</div>';var errorNode=div.find("div.alert-message");var notAdded;if(errorNode.length){notAdded=false;errorNode.text(text);}else{notAdded=true;}
if(parameter1!==parameter2&&notAdded){div.addClass("error");div.find("label").after(msg);}else if(parameter1===parameter2){div.removeClass("error");errorNode.remove();}}
function checkPasswordsMatch(event){var $this=$(event.target);var password=$this.closest(".form-field,.form-group").prev().find("input").val();var confirmPassword=$this.val();var div=$this.closest(".form-field,.form-group");mainCheck(div,password,confirmPassword,"Passwords do not match");}
function checkStrengthRemoveErrIfMatches(event){var $this=$(event.target);var password=$this.val();var confirmPassId=$this.attr('id')+'-clone';var confirmPassword=$('#'+confirmPassId).val();var div=$this.closest(".form-field,.form-group").next();if(confirmPassword.length){mainCheck(div,password,confirmPassword,"Passwords do not match");}
var text="Your password should have at least";var meetRequirements=true;if(password.length<7){text+=" 7 characters";meetRequirements=false;}
if(password.match(/[A-Z]+/)===null){text+=" 1 capital letter";meetRequirements=false;}
if(password.match(/[a-z]+/)===null){text+=" 1 non-capital letter";meetRequirements=false;}
if(password.match(/[0-9]+/)===null){text+=" 1 digit";meetRequirements=false;}
if(password.match(/[!@#$%^&*()_+|\/.,~?><:{}-]+/)===null){text+=" 1 special character";meetRequirements=false;}
div=$this.closest(".form-field,.form-group");mainCheck(div,meetRequirements,true,text);}
$("input[type='password']").not("[id$='-clone']").keyup(checkStrengthRemoveErrIfMatches);$("input[id$='-clone'][type='password']").keyup(checkPasswordsMatch);});$(function(){"use strict";$(':disabled').closest('form').submit(function(){$(':disabled').attr('disabled',false);});});$(function(){"use strict";var getIeVersion=function(){if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){var ieVersion=Number(RegExp.$1);return ieVersion;}};if(getIeVersion()<10){$('select').filter('[placeholder]').removeAttr('placeholder');$('[placeholder]').focus(function(){var input=$(this);if(input.val()===input.attr('placeholder')){input.val('');input.removeClass('placeholder');}}).blur(function(){var input=$(this);if(input.val()===''||input.val()===input.attr('placeholder')){input.addClass('placeholder');input.val(input.attr('placeholder'));}}).blur();$('[placeholder]').parents('form').submit(function(){$(this).find('[placeholder]').each(function(){var input=$(this);if(input.val()===input.attr('placeholder')){input.val('');}});});}});