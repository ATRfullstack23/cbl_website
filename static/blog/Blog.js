Blog = function (rowId, columnId, allowEdit, editConfig) {
    this.rowId = rowId; columnId
    this.columnId = columnId;
    this.initialize();
    this.getData();
    this.sortType = 'desc';
    this.allowEdit = allowEdit;
    this.roleBased = false;
    if (editConfig)
        this.editConfiguration = editConfig;
    this.users = {};
    //console.log(window.parentSubModuleConfig.emailConfig);
    return this;
}

Blog.prototype = {
    _selectors: {
        btnBackToParentModule: "#btnBackToParentModule",
        divBlogViewMainControls: "#divBlogViewMainControls",
        addButton: "#btnAddNewBlogEntry",
        container: "#blogContainer",
        repliesContainer: "#blogRepliesContainer",
        btnSort: '#btnSortBlog',
        ulRoleBased: '#ulRoleBased',
        divTagsFilterContainer: '#divTagsFilterContainer',
        ulTagsFilter: '#ulTagsFilter',
        divActiveUsers: '#divActiveUsers',
        spanParameters: '#spanParameters'
    },
    initialize: function () {
        var blog = this;
        this.buttons = {};
        this.buttons.add = $(this._selectors.addButton);
        this.formView = new FormView(this);
        this.buttons.add.on('click', function () {
            if(blog.isInRepliesMode()){
                blog.formView.show('create', undefined, {
                    parentBlogEntry : blog.selectedBlogEntry
                });
            }
            else{
                blog.formView.show('create');
            }
        });

        this.btnSort = $(this._selectors.btnSort);
        this.btnSort.detach();//Not used currently;
        this.btnSort.on('click', function () {
            if (blog.sortType == 'desc') {
                blog.sortType = 'asc';
                $(this).val('Sort from Latest to Oldest');
                $(this).attr('title', 'Currently is Oldest to Latest');
            }
            else {
                blog.sortType = 'desc';
                $(this).val('Sort from Oldest to Latest')
                $(this).attr('title', 'Currently is Latest to Oldest');
            }
            blog.getData();
        });
        this.btnBackToParentModule = $(this._selectors.btnBackToParentModule);
        this.btnBackToParentModule.on('click', function () {
            if(blog.isInRepliesMode()){
                blog.setToNormalMode();
            }
            else{
                closeBlogView();
            }
        });
        this.divBlogViewMainControls = $(this._selectors.divBlogViewMainControls);



        this.ulRoleBased = $(this._selectors.ulRoleBased);
        this.ulRoleBased.on('click', 'li', function () {
            var li = $(this);
            if (li.hasClass('module-navigation-item-selected'))
                return;
            var roleBased = li.data('value') == 'mine';
            blog.ulRoleBased.find('li').removeClass('module-navigation-item-selected');
            li.addClass('module-navigation-item-selected');
            blog.roleBased = roleBased;
            blog.getData();
        });


        this.divTagsFilterContainer = $(this._selectors.divTagsFilterContainer);
        this.ulTagsFilter = $(this._selectors.ulTagsFilter);
        this.ulTagsFilter.on('click', 'li', function () {
            var li = $(this);
            li.toggleClass('selected');
            blog.getData();
        });



        // this.mainHeader = $(this._selectors.mainHeader);
        this.container = $(this._selectors.container);
        this.repliesContainer = $(this._selectors.repliesContainer);
        this.ifc = new ImageFromClipboard();
        //        $( '#button' ).css( 'top', $( '#header' ).outerHeight() );
        //        $( '#blogContainer' ).css( 'top', $( '#button' ).outerHeight() + $( '#button' ).offset().top );
        blog.getParameterData();
    },
    getSelectedTagsToFilter: function () {
        var self = this;
        if(!self.selectedTagsToFilter){
            self.selectedTagsToFilter = [];
        }
        self.selectedTagsToFilter.length = 0;

        self.ulTagsFilter.find('li.selected').each(function () {
           self.selectedTagsToFilter.push($(this).attr('value'));
        });
        return self.selectedTagsToFilter;
    },
    populateTagsFilterArea: function () {
        var self = this;


        var currentSelectedTags = self.getSelectedTagsToFilter();

        self.ulTagsFilter.empty();

        blog.tagsUsedInCurrentContext.forEach(function (tagInfo) {
            var li = $(document.createElement('li'));
            li.attr('value', tagInfo.id);
            li.text(tagInfo.displayName);


            if(currentSelectedTags.indexOf(tagInfo.id +'') != -1){
                li.addClass('selected');
            }

            self.ulTagsFilter.append(li);
        });

    },
    initializeSelectedTagsForFilter: function () {
        var self = this;

    },
    getParameterData: function () {
        // var row = app.getSelectedModule().formattedViewData[this.rowId];
        // var columns = app.getSelectedModule().columnManager.columns;
        // var column = columns[this.columnId];
        //
        // if (column.parameters) {
        //     var parameter = '';
        //     for (var key in column.parameters) {
        //         if (column.parameters[key])
        //             parameter += columns[column.parameters[key]].displayName + ': ' + row[column.parameters[key]] + '; ';
        //     }
        //     $(spanParameters).html(parameter);
        // }
    },
    get parentColumnUniqueId() {
        return parentSubModuleConfig.hyperlinkColumn.uniqueName;
    },
    get parentColumn() {
        return parentSubModuleConfig.hyperlinkColumn;
    },
    get parentSubModule() {
        return parentSubModuleConfig.parentSubModule;
    },
    get parentRowId() {
        return parentSubModuleConfig.parameters.id;
    },
    setSelectedBlogEntry: function (blogEntryToSelect) {
        var blog = this;
        blog.selectedBlogEntry = blogEntryToSelect;
        blog.getData();

        blog.ulRoleBased.css('visibility', 'hidden');
        blog.divTagsFilterContainer.css('display', 'none');
        blog.container.addClass('repliesMode');
        blog.selectedBlogEntry.container.addClass('selected');
        blog.btnBackToParentModule.val('Back To All Posts');
        blog.divBlogViewMainControls.addClass('repliesMode');
        blog.buttons.add.val('Add Reply');
    },
    setToNormalMode: function () {
        var self = this;
        self.container.removeClass('repliesMode');
        blog.selectedBlogEntry.container.removeClass('selected');
        blog.selectedBlogEntry = undefined;
        blog.repliesContainer.empty();
        blog.repliesContainer.detach();

        blog.buttons.add.css('visibility', '');
        blog.ulRoleBased.css('visibility', '');
        blog.divTagsFilterContainer.css('display', '');
        blog.btnBackToParentModule.val('Go Back');
        blog.divBlogViewMainControls.removeClass('repliesMode');
        blog.buttons.add.val('Add New Entry');
    },
    isInRepliesMode: function () {
        if(this.selectedBlogEntry){
            return true;
        }
        return false;
    },
    getData: function () {
        var blog = this;

        var data = {
            parentRowId: blog.parentRowId,
            tagsToFilter : blog.getSelectedTagsToFilter()
        };
        if (blog.sortType == 'desc'){
            data.SortDescending = true;
        }
        if (blog.roleBased){
            data.showUserPostsOnly = true;
        }

        if (blog.selectedBlogEntry){
            data.parentBlogEntryId = blog.selectedBlogEntry.blogEntryId;
        }


        var url = '/blog/@blogUniqueId@/GetAllData';
        url = url.replace('@blogUniqueId@', blog.parentColumnUniqueId)
        $.ajax({
            type: 'POST',
            url: url,
            data: data
        }).always(function (data) {
            // console.log('received data', data)

            $('html,body').animate({ scrollTop: 0}, 'fast')

            if(blog.isInRepliesMode()){
                blog.selectedBlogEntry.repliesDataTable = data.result.blogPostEntries;
                blog.generateView_Replies();
            }
            else{
                blog.dataTable = data.result.blogPostEntries;
                blog.allTags = data.result.tags;
                blog.tagsUsedInCurrentContext = data.result.tagsUsedInCurrentContext;

                blog.populateTagsFilterArea();
                blog.generateView();
            }


        });

    },
    addewlyCreatedTagsToCache: function (newTags) {
        var self = this;
        for(var key in newTags){
            var displayName = key.replace('new-custom-value-', '');
            blog.allTags.push({
                id : newTags[key],
                displayName: displayName
            })
        }
    },
    getTagInfoFromId: function (id) {
        var self = this;
        var indexOfTag = self.allTags.findIndex(function(tagInfoInFindIndex){
            return tagInfoInFindIndex.id == id;
        });
        if(indexOfTag == -1){
            return;
        }
        return self.allTags[indexOfTag];
    },
    getTagInfoFromText: function (text) {
        var self = this;
        var indexOfTag = self.allTags.findIndex(function(tagInfoInFindIndex){
            return tagInfoInFindIndex.displayName == text;
        });
        if(indexOfTag == -1){
            return;
        }
        return self.allTags[indexOfTag];
    },
    _defaultCard: '{ "blogEntriesItemsId" : 99, "layoutType" : "paragraph", "paragraphContent" : "<b><font size={:dq:}5{:dq:}>Blog is empty. Click to add new entry...</font></b><br>", "orderByIndex" : ""}',
    generateView: function () {
        var self = this;
        self.generateTagsFilterArea();
        self.generateViewBlogEntries();
    },
    generateTagsFilterArea: function () {
        var self = this;
    },
    generateViewBlogEntries: function () {
        var blog = this;
        blog.container.empty();
        blog.blogEntries = {};
        var isDefaultItem = false;
        if (!blog.dataTable.length) {
            var tempBlogEntryItem = JSON.parse(blog._defaultCard);
            var tempBlogEntry = JSON.parse('{"blogEntryId":"114","creator":"1","createdByUserName":"admin","createdAtTimestampInUtc":"6/17/2019 6:03:46 PM","dateDifference":"1.44419357833333"}');
            tempBlogEntry.showCreator = false;
            tempBlogEntry.creator = parentSubModuleConfig.user.usersID;
            tempBlogEntry.configuration = JSON.stringify(tempBlogEntryItem);
            blog.dataTable.push(tempBlogEntry);
            isDefaultItem = true;
        }

        // console.log('generateView', blog.dataTable);

        for (var i = 0; i < blog.dataTable.length; i++) {
            var current = blog.dataTable[i];
            if (!blog.blogEntries.hasOwnProperty(current.blogEntryId)) {
                blog.blogEntries[current.blogEntryId] = new BlogEntry(current);
            }
            blog.blogEntries[current.blogEntryId].addItem(new BlogEntryItem(current, null, blog.blogEntries[current.blogEntryId]));
        }
        // var animationDuration = 100;
        var keyArr = Object.keys(blog.blogEntries);
        // if (blog.sortType == 'desc') {
        //     keyArr = keyArr.reverse();
        // }

        blog.users = {};

        for (var key in keyArr) {
            var blogEntry = blog.blogEntries[keyArr[key]];
            this.container.prepend(blogEntry.container);



            // if (isDefaultItem) {
            //     if (blogEntry.editButton)
            //         blogEntry.editButton.remove();
            //     blogEntry.container.css({ cursor: 'pointer', opacity: '.4' }).on('click', function () {
            //         blog.formView.show('create');
            //     }).hover(function () {
            //         blogEntry.container.css('opacity', '1');
            //     }, function () {
            //         blogEntry.container.css('opacity', '.4');
            //     });
            // }

            blogEntry.initializeFooterArea();
            blogEntry.onAppendedToContainer();
        }

    },


    generateView_Replies: function () {
        var self = this;


        self.generateViewBlogEntries_Replies();
    },
    generateViewBlogEntries_Replies: function () {
        var blog = this;
        var selectedBlogEntry = blog.selectedBlogEntry;
        console.log('generateViewBlogEntries_Replies', selectedBlogEntry.repliesDataTable);
        selectedBlogEntry.replyBlogEntries = {};

        for (var i = 0; i < selectedBlogEntry.repliesDataTable.length; i++) {
            var current = selectedBlogEntry.repliesDataTable[i];
            if (!selectedBlogEntry.replyBlogEntries.hasOwnProperty(current.blogEntryId)) {
                selectedBlogEntry.replyBlogEntries[current.blogEntryId] = new BlogEntry(current);
            }
            selectedBlogEntry.replyBlogEntries[current.blogEntryId].addItem(new BlogEntryItem(current, null, selectedBlogEntry.replyBlogEntries[current.blogEntryId]));
        }
        // var animationDuration = 100;
        var keyArr = Object.keys(selectedBlogEntry.replyBlogEntries);
        // if (blog.sortType == 'desc') {
        //     keyArr = keyArr.reverse();
        // }

        blog.repliesContainer.empty();

        for (var key in keyArr) {
            var blogEntry = selectedBlogEntry.replyBlogEntries[keyArr[key]];
            blog.repliesContainer.append(blogEntry.container);

            blogEntry.initializeFooterArea();
            blogEntry.onAppendedToContainer();
        }

        selectedBlogEntry.container.after(blog.repliesContainer);
    },



}



BlogEntry = function ( data ) {
    this.initialize( data);
    return this;
}

BlogEntry.prototype = {
    initialize: function ( data ) {
        var self = this;
        this.container = $( document.createElement( 'div' ) ).attr( 'class', 'blog-entry' );
        this.headerElement = $( document.createElement( 'header' ) ).attr( 'class', 'blog-entry-header' );

        this.titleElement = $( document.createElement( 'div' ) ).attr( 'class', 'blog-entry-header-title' );
        this.tagsElement = $( document.createElement( 'div' ) ).attr( 'class', 'blog-entry-header-tags' );
        this.tagsElement.html(`
            <ul class="selectedTags"></ul>
            <div class="editTagsContainer">
                <select class="editTagsElement" multiple data-placeholder="Choose Tags..."></select>
                <div class="editTagsButtons">
                    <button data-button-for="save" class="button-normal">Save</button>
                    <button data-button-for="cancel" class="button-normal">Cancel</button>
                </div>
            </div>
            <button data-button-for="edit" class=""><img src="Images/edit.gif"></button>
        `);

        this.ulSelectedTags = this.tagsElement.find('.selectedTags');

        this.btnShowEditTagsUi = this.tagsElement.find('button[data-button-for="edit"]');
        this.btnCancelEditTagsUi = this.tagsElement.find('button[data-button-for="cancel"]');
        this.btnSaveEditTagsUi = this.tagsElement.find('button[data-button-for="save"]');

        this.divEditTagsContainer = this.tagsElement.find('.editTagsContainer');
        this.ddlEditTagsElement = this.tagsElement.find('.editTagsElement');

        this.headerElement.append(this.titleElement);
        this.headerElement.append(this.tagsElement);

        this.headerElement.appendTo(this.container);

        if ( data ) {
            this.blogEntryId = data.blogEntryId;
            this.parentBlogEntryId = data.parentBlogEntryId;
            this.creator = data.creator;
            this.isOwnerCurrentUser = data.isOwnerCurrentUser;
            this.createdByUserName = data.createdByUserName;
            this.createdAtTimestampInUtc = new Date( data.createdAtTimestampInUtc );

            this.tags = data.tags || [];
            this.title = data.title || '';
            this.numberOfReplies = data.numberOfReplies || 0;

            this.titleElement.text(this.title);


            if(this.parentBlogEntryId){
                this.container.addClass('replyBlogEntry')
            }

            this.initializeSelectedTagsElement();

            var bindEvent = false;
            if ( blog.allowEdit ) {
                if ( !blog.editConfiguration )
                    bindEvent = true;
                else {
                    var editConfiguration = blog.editConfiguration;
                    var user = parentSubModuleConfig.user;
                    if ( !editConfiguration.validate )
                        bindEvent = true;
                    else {
                        bindEvent = true;
                        if ( editConfiguration.editingEnabled == user.rolesID )
                            bindEvent = true;
                        if ( editConfiguration.editingDisabled == user.rolesID )
                            bindEvent = false;
                    }
                }
            }
            this.bindViewEvents();
            if ( bindEvent ) {
                if ( !blog.editConfiguration.freezeAfter ) {
                    this.bindEvents();
                }
                else {
                    if ( parseFloat( blog.editConfiguration.freezeAfter ) > data.dateDifference )
                        this.bindEvents();
                    else
                        bindEvent = false;
                }
            }
            if ( !bindEvent && blog.editConfiguration && blog.editConfiguration.adminMode ) {
                if ( blog.editConfiguration.adminMode == parentSubModuleConfig.user.rolesID ) {
                    this.bindEvents();
                    bindEvent = true;
                }
            }
            this.eventsBound = bindEvent;


            if(self.isOwnerCurrentUser){
                this.btnShowEditTagsUi.on('click', function () {
                    self.setTagsToEditMode();
                });
                this.btnCancelEditTagsUi.on('click', function () {
                    self.cancelTagsInEditMode();
                });
                this.btnSaveEditTagsUi.on('click', function () {
                    self.saveTagsInEditMode();
                });
            }
            else{
                this.btnShowEditTagsUi.detach();
            }



        }
        this.items = {};

        //$('#button').css('top', $('#header').outerHeight());
        //$('#blogContainer').css('top', '60px');
    },
    isChildBlogEntry: function () {
        if(this.parentBlogEntryId){
            return true;
        }
        return false;
    },
    initializeFooterArea: function () {
        var blogEntry = this;

        var footer = $(document.createElement('footer'));

        var timestampInfoDiv = $(document.createElement('div')).addClass('timestampInfo');
        var repliesInfoDiv = $(document.createElement('div'))
            .addClass('repliesInfo')
            .html('<span class="spanNoOfReplies">View Replies</span><button class="button-normal btnAddReplyToBlogEntry">Reply</button>');

        // if (!blog.users[blogEntry.creator]) {
        //     blog.users[blogEntry.creator] = blogEntry.createdByUserName;
        // }
        var lastEditString = _utils.getLastEditDateString(blogEntry.createdAtTimestampInUtc);

        var formattedTimestamp = moment(blogEntry.createdAtTimestampInUtc).format('dddd, DD MMM hh:mm a');

        timestampInfoDiv.text("By " + blogEntry.createdByUserName + " @ " + lastEditString + " (" + formattedTimestamp + ")");
        timestampInfoDiv.attr('title', formattedTimestamp);
        // this.container.append(timestampInfoDiv);
        footer.append(timestampInfoDiv);
        if(!blogEntry.isChildBlogEntry()){
            footer.append(repliesInfoDiv);
        }

        blogEntry.spanNoOfReplies = repliesInfoDiv.find('.spanNoOfReplies');
        blogEntry.spanNoOfReplies.on('click', function () {
            blog.setSelectedBlogEntry(blogEntry);
        });
        if(blogEntry.numberOfReplies){
            blogEntry.spanNoOfReplies.text(blogEntry.numberOfReplies + ' Replies')
        }
        else{
            blogEntry.spanNoOfReplies.text('')
        }

        blogEntry.btnAddReplyToBlogEntry = repliesInfoDiv.find('.btnAddReplyToBlogEntry');
        blogEntry.btnAddReplyToBlogEntry.on('click', function () {
            blog.formView.show('create', undefined, {
                parentBlogEntry : blogEntry
            });
            if(!blog.isInRepliesMode()){
                blog.setSelectedBlogEntry(blogEntry);
            }
        });

        blogEntry.titleElement.on('click', function () {
            blog.setSelectedBlogEntry(blogEntry);
        });

        blogEntry.container.append(footer);

    },
    initializeSelectedTagsElement: function () {
        var self = this;
        self.ulSelectedTags.empty();
        self.tags.forEach(function (tagInfo) {
            var li = $(document.createElement('li'));
            li.attr('value', tagInfo.id);
            li.text(tagInfo.displayName);
            self.ulSelectedTags.append(li);
        });

    },
    setTagsToNormalMode: function (hasChanged) {
        var self = this;
        self.tagsElement.removeClass('editMode');
        self.ddlEditTagsElement.chosen('destroy');
        self.ddlEditTagsElement.empty();

        if(hasChanged){
            self.initializeSelectedTagsElement();
        }
    },
    saveTagsInEditMode: function () {
        var self = this;
        var newSelectedTags = self.ddlEditTagsElement.val();
        self.saveSelectedTagsToServer(newSelectedTags, function (err, response) {
            console.log('received UpdateBlogEntryTags result', response);

            var result = response.result;
            var newSelectedTagIds = result.newSelectedTagIds;
            var newTags = result.newTags;

            var newSelectedTags = [];

            blog.addewlyCreatedTagsToCache(newTags);

            newSelectedTagIds.forEach(function (newTagId) {
                newSelectedTags.push(blog.getTagInfoFromId(newTagId));
            });

            self.tags = newSelectedTags;

            self.setTagsToNormalMode(true);
        });
    },
    cancelTagsInEditMode: function () {
        var self = this;
        self.setTagsToNormalMode();
    },
    setTagsToEditMode: function () {
        var self = this;
        self.tagsElement.addClass('editMode');

        self.ddlEditTagsElement.empty();

        blog.allTags.forEach(function (tagInfo) {
            var option = $(document.createElement('option'));
            option.attr('value', tagInfo.id);
            option.text(tagInfo.displayName);

            var indexOfTag = self.tags.findIndex(function(tagInfoInFindIndex){
                return tagInfoInFindIndex.id == tagInfo.id;
            });

            if(indexOfTag != -1){
                option.attr('selected', 'selected');
            }

            self.ddlEditTagsElement.append(option);
        });

        self.ddlEditTagsElement.chosen({
            // width: "86%",
            search_contains: true,
            allow_single_deselect: true,
            "no_results_text": "Click to Create Tag",
            onNoResultsClick: function(searchValue){
                self.onAddNewTagAndSetAsSelected(searchValue);
            },
            onNoResultsEnter: function(searchValue){
                self.onAddNewTagAndSetAsSelected(searchValue);
            }
        });
    },
    onAddNewTagAndSetAsSelected: function (newTagText) {
        var self = this;
        var option = $(document.createElement('option'));
        option.attr('value', 'new-custom-value-' + newTagText);
        option.text(newTagText);
        option.attr('selected', 'selected');

        self.ddlEditTagsElement.append(option);
        self.ddlEditTagsElement.trigger("chosen:updated");
    },
    onAppendedToContainer: function () {
        var self = this;



    },
    saveSelectedTagsToServer: function (newTags, saveSelectedTagsToServer) {
        var self = this;

        var data = {
            blogEntryId: self.blogEntryId,
            selectedTags: newTags
        };

        console.log('UpdateBlogEntryTags data', data);

        var url = '/blog/@blogUniqueId@/UpdateBlogEntryTags';
        url = url.replace('@blogUniqueId@', blog.parentColumnUniqueId)
        $.ajax({
            type: 'POST',
            url: url,
            data: data
        }).always(function (result, status) {
            // console.log('received UpdateBlogEntryTags result', result)

            saveSelectedTagsToServer && saveSelectedTagsToServer(null, result);

        });

    },


    generateView: function () {
        for ( var key in this.items ) {
            var item = this.items[key];
            this.container.append( item.container );
        }
    },
    addItem: function ( item ) {
        this.items[item.blogEntryItemId] = item;
        this.generateViewForItem( item );
    },
    generateViewForItem: function ( item ) {
        this.container.append( item.container );
        var style = item.container.find( 'div' ).attr( 'style' );
        item.container.find( '.blog-item-textarea' ).removeAttr( 'style' );
        setTimeout( function () {
            item.container.find( '.blog-item-textarea' ).attr( 'style', 'display: inline-block; width: 90%' )
        }, 50 );
    },
    bindViewEvents: function () {
        var blogEntry = this;
        blogEntry.container.on( 'click.viewMode', 'img.blog-item-image', function () {
            var element = $( this );
            if ( isThumbnailCreationSupportedForExtension(element.data( 'extension' )) ) {
                _imagePopup.show( element.data( 'url' ), element.data( 'filename' ) );
            }
            else {
                var src = element.data( 'url' ).toLowerCase();
                if ( src.match( 'pdf$' ) == 'pdf' ) {
                    window.open( src );
                }
                else {
                    var iframe = $( document.createElement( 'iframe' ) );
                    iframe.attr( 'src', element.data( 'url' ) );
                    iframe.css( { display: 'none' } );
                    $( document.body ).append( iframe );
                    iframe.load( function () {
                        iframe.remove();
                    } );
                }
            }
        } );
    },
    bindEvents: function () {
        var blogEntry = this;
        blogEntry.editButton = $( document.createElement( 'div' ) ).html( 'edit' ).addClass( 'div-edit-button' ).attr( 'id', 'edit_' + blogEntry.blogEntryId );
        blogEntry.editButton.data( 'blogEntry', blogEntry );
        blogEntry.container.append( blogEntry.editButton );
        blogEntry.editButton.on( 'click', function () {
            blog.formView.show( 'edit', $( this ).data( 'blogEntry' ) );
        } );

        // blogEntry.container.addClass('editable')

        // blogEntry.container.on( 'mouseenter.viewMode', function ( eve ) {
        //     $( this ).find( '.div-edit-button' ).show();
        // } )
        // .on( 'mouseleave.viewMode', function () {
        //     $( this ).find( '.div-edit-button' ).hide();
        // } )
    },
    unbindEvents: function () {
        var blogEntry = this;
        blogEntry.container.off( 'mouseenter.viewMode' );
        blogEntry.container.off( 'mouseleave.viewMode' );
        blogEntry.container.off( 'click.viewMode' );
        blogEntry.editButton.hide();
    },
    showEditMode: function () {
        this.unbindEvents();
        for ( var key in this.items ) {
            var item = this.items[key];
            item.bindEvents();
        }
    },
    showViewMode: function () {
        this.bindEvents();
        for ( var key in this.items ) {
            var item = this.items[key];
            item.unbindEvents();
        }
    }
}



BlogEntryItem = function ( id, itemType, blogEntry ) {
    if ( typeof ( id ) == 'number' ) {
        this.blogEntryItemId = id;
        this.initialize( id, itemType, blogEntry );
    }
    else {
        this.initializeFromConfiguration( id, blogEntry );
    }
    return this;
}

BlogEntryItem.prototype = {
    initializeFromConfiguration: function (config, blogEntry) {
        var blogEntryItem = this;
        blogEntryItem.configuration = config;
        // config = JSON.parse(config);
        // for (var key in config) {
        //     if (typeof (config[key]) == "string")
        //         config[key] = decode(config[key]);
        // }
        blogEntryItem.blogEntry = blogEntry;
        blogEntryItem.blogEntryItemId = config.blogEntryItemId;
        var itemType = config.layoutType;
        var orderByIndex = config.orderByIndex;
        var item = blogEntryItem._itemTypes.getItemType(blogEntryItem.blogEntryItemId, itemType);
        for (var key in item) {
            blogEntryItem[key] = item[key];
        }

        // if (config.paragraphContent)
        //     config.paragraphContent = decode(decodeURIComponent(config.paragraph));

        if (blogEntryItem.paragraph) {
            blogEntryItem.paragraph.html(config.paragraphContent);//.removeAttr('contenteditable');
        }
        // console.log('blogEntryItem', blogEntryItem);
        if (config.imageInfo) {
            //config.image = decodeURIComponent(config.image);
            var actualFilename = config.imageInfo.filename;
            var actualExtension = config.imageInfo.extension;

            // var realExtension = config.imageInfo.substring(config.image.lastIndexOf('.') + 1);
            // var extension = config.imageInfo.substring(config.image.lastIndexOf('.') + 1).toLowerCase();

            var actualUrl = '/blog/uploads/' + blog.parentColumnUniqueId + '/' + blogEntryItem.blogEntryItemId + '/' + actualFilename;
            var thumbnailUrl = '/blog/uploads/' + blog.parentColumnUniqueId + '/' + blogEntryItem.blogEntryItemId + '/' + blogEntryItem.blogEntryItemId + '.' + actualExtension;

            if(isThumbnailCreationSupportedForExtension(actualExtension)){
                thumbnailUrl = '/blog/uploads/' + blog.parentColumnUniqueId + '/' + blogEntryItem.blogEntryItemId + '/' + blogEntryItem.blogEntryItemId + '_medium.' + actualExtension;
            }
            else {
                thumbnailUrl = blogEntryItem.getThumbnailImageForExtension(actualExtension);
                blogEntryItem.image.addClass('usingDefaultIcon');
                blogEntryItem.container.addClass('usingDefaultIcon');
            }
            blogEntryItem.image.attr('src', thumbnailUrl);
            blogEntryItem.image.attr('data-fullSizeImage', actualUrl);
            blogEntryItem.image.data('url', actualUrl).data('filename', actualFilename).data('extension', actualExtension);
        }
        if (blogEntryItem.discard) {
            blogEntryItem.discard.remove();
        }
        blogEntryItem.container.attr('data-layout-type',blogEntryItem.type)
        // var table = blogEntryItem.container.children('table');
        // if (table)
        //     table.css('display', 'table').css('width', '100%');
    },
    getThumbnailImageForExtension: function (extension) {
        return 'Images/fileTypes/' + extension + '.png';
    },
    initialize: function (id, itemType, blogEntry) {
        var blogEntryItem = this;
        this.blogEntry = blogEntry;
        var item = this._itemTypes.getItemType(id, itemType);
        for (var key in item) {
            this[key] = item[key];
        }
        this.bindEvents();
    },
    bindEvents: function () {
        var blogEntryItem = this;


        if (this.fileUpload) {
            this.clipboard.on('click.editMode', function () {
                blogEntryItem._events.clipboardClicked(blogEntryItem);
            });
            this.image.closest('.div-blogentryitem-container').on('mouseover.editMode', function () {
                blogEntryItem._events.imageMouseover(blogEntryItem);
            });
            this.image.closest('.div-blogentryitem-container').on('mouseout.editMode', function () {
                blogEntryItem._events.imageMouseout(blogEntryItem);
            });
            this.image.on('click.editMode', function () {
                blogEntryItem._events.imageClicked(blogEntryItem);
            });
            this.fileUpload.on('change.editMode', function () {
                blogEntryItem._events.fileChanged(blogEntryItem);
            }).prop('changed', false);
        }
        if (this.paragraph) {
            // this.paragraph.prop('contenteditable', true);
            this.paragraph.on('click.editMode', function () {
                blogEntryItem._events.paragraphFocused(blogEntryItem);
            });

            var tempId = 'tempId_' + new Date().getTime();
            blogEntryItem.paragraph.attr('data-temp-id', tempId)
            var selector = '[data-temp-id="' + tempId + '"]';

            setTimeout(function () {
                tinymce.init({
                    selector: selector,
                    theme: "modern",
                    plugins: [
                        "advlist autolink lists link charmap print preview hr anchor pagebreak",
                        "searchreplace wordcount visualblocks visualchars code fullscreen",
                        "insertdatetime nonbreaking save table contextmenu directionality",
                        "emoticons template paste textcolor colorpicker textpattern"
                    ],
                    toolbar1: " undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                    toolbar2: "print preview media | forecolor backcolor emoticons",
                    image_advtab: true,
                    templates: [
                        {title: 'Test template 1', content: 'Test 1'},
                        {title: 'Test template 2', content: 'Test 2'}
                    ]
                });
            }, 300);


        }
        this.discard.on('click.editMode', function () {
            blogEntryItem._events.discardClicked(blogEntryItem);
        });


        this.discard.show();
    },
    unbindEvents: function () {
        var blogEntryItem = this;
        if (this.fileUpload) {
            this.image.closest('td').off('mouseover.editMode');
            this.image.closest('td').off('mouseout.editMode');
            this.image.off('click.editMode');
            this.fileUpload.off('change.editMode');
        }
        if (this.paragraph) {
            //this.paragraph.prop('contenteditable', false);
            this.paragraph.off('click.blogEntryItem focus.editMode');
        }
        this.discard.off('click.editMode');
        this.discard.hide();
    },
    uploadImage: function (element) {
        if (!element.get(0).files.length) {
            return;
        }
        var file = element.get(0).files[0];

        blog.formView.enableDisableSubmit(true);

        element.data('fileUploadResult', null);

        blog.parentSubModule.uploadFile(file, {
            onProgress: function (progressPercent) {
                console.log('onProgress : ' + progressPercent);
            },
            onLoad: function (response) {
                console.log('onLoad : ', response);
                blog.formView.enableDisableSubmit(false);
                if(response.success){
                    element.data('fileUploadResult', response)
                }
            }
        });

        // var req = new XMLHttpRequest();
        //
        // var url = '/uploadFile';
        // url = url.replace('@blogUniqueId@', blog.parentColumnUniqueId)
        //
        // req.open('POST', url, true);
        // req.element = element;
        // req.setRequestHeader('Content-Type', file.type);
        // req.setRequestHeader('X-FileName', file.name);
        // req.setRequestHeader('X-ParentRowId', blog.rowId);
        // blog.formView.enableDisableSubmit(true);
        // req.onreadystatechange = function () {
        //     if (req.readyState == 4) {
        //         blog.formView.enableDisableSubmit(false);
        //     }
        // }

        // req.send(file);
    },
    isDocument: function (extension) {
        var documentExtensionArr = ['pdf', 'txt', 'xls', 'xlsx', 'doc', 'docx'];
        return (documentExtensionArr.indexOf(extension) != -1);
    },
    _events: {
        clipboardClicked: function (blogEntryItem) {
            var saveFromClipboard = function (dataImage, fileName, blob, fileUploadResult) {
                blogEntryItem.image.prop('changed', true);
                blogEntryItem.image.get(0).src = dataImage;
                blogEntryItem.fileUpload.data('clipboard', fileName);
                blogEntryItem.fileUpload.data('fileUploadResult', fileUploadResult);
                getImageInfoFromFile(blob, function (err, imageInfo) {
                    blogEntryItem.image.data('imageInfo', imageInfo);
                });
            };
            blog.ifc.show(saveFromClipboard);
        },
        imageMouseover: function (blogEntryItem) {
            blogEntryItem.image.prev().show();
        },
        imageMouseout: function (blogEntryItem) {
            blogEntryItem.image.prev().hide();
        },
        imageClicked: function (blogEntryItem) {
            blogEntryItem.fileUpload.click();
        },
        fileChanged: function (blogEntryItem) {
            blogEntryItem.image.prop('changed', true);
            blogEntryItem.fileUpload.data('clipboard', null);
            if (!blogEntryItem.fileUpload.get(0).files.length) {
                blogEntryItem.image.attr('src', "Images/add_image.png");
                return;
            }
            blogEntryItem.uploadImage(blogEntryItem.fileUpload);
            // 'Images/' + blogEntryItem.getThumbnailImageForExtension(extension)

            var fileName = blogEntryItem.fileUpload.get(0).files[0].name;
            var extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

            getImageInfoFromFile(blogEntryItem.fileUpload.get(0).files[0], function (err, imageInfo) {
                if(err){
                    console.log('getImageInfoFromFile Error ', err)
                    return;
                }
                //console.log(blogEntryItem.image, imageInfo)
                blogEntryItem.image.data('imageInfo', imageInfo);
            });

            if (!isThumbnailCreationSupportedForExtension(extension)) {
                var imgUrl = blogEntryItem.getThumbnailImageForExtension(extension);
                blogEntryItem.image.get(0).src = imgUrl;
                return;
            }



            var reader = new FileReader();
            reader.onloadend = function () {
                blogEntryItem.image.get(0).src = reader.result;
            }
            reader.readAsDataURL(blogEntryItem.fileUpload.get(0).files[0]);

        },
        paragraphFocused: function (blogEntryItem) {



            // var tempId = 'tempId_' + new Date().getTime();
            // blogEntryItem.paragraph.attr('data-temp-id', tempId)
            // var selector = '[data-temp-id="' + tempId + '"]';
            //
            // tinymce.init({
            //     selector: selector,
            //     theme: "modern",
            //     plugins: [
            //         "advlist autolink lists link charmap print preview hr anchor pagebreak",
            //         "searchreplace wordcount visualblocks visualchars code fullscreen",
            //         "insertdatetime nonbreaking save table contextmenu directionality",
            //         "emoticons template paste textcolor colorpicker textpattern"
            //     ],
            //     toolbar1: " undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
            //     toolbar2: "print preview media | forecolor backcolor emoticons",
            //     image_advtab: true,
            //     templates: [
            //         {title: 'Test template 1', content: 'Test 1'},
            //         {title: 'Test template 2', content: 'Test 2'}
            //     ]
            // });

            // blogEntryItem.paragraph.on('blur', function () {
            //     tinymce.remove(selector);
            // });

        },
        discardClicked: function (blogEntryItem) {
            delete blog.formView.blogEntry.items[blogEntryItem.blogEntryItemId];
            blogEntryItem.container.remove();
        }
    },
    _itemTypes: {
        _html: {
            paragraph: '<div id="container_@id@" class="div-blogentryitem-container"><div style="" class="blog-item-textarea"id="p_@id@"><br/></div>&nbsp;<input type="button" id="discard_@id@" value="X" class="button-discard button-normal" /></div>',
            image: '<div id="container_@id@" class="div-blogentryitem-container"><div id="clipboard_@id@" class="blog-item-clipboard" style="display:none;position:absolute;">Clipboard</div><img style="" class="blog-item-image" src="Images/add_image2.png"id="img_@id@" /><input type="file" id="file_@id@" style="display: none;" /><input type="button" id="discard_@id@"  value="X"  class="button-discard button-discard-image button-normal" /></div>',
            paragraphImage: '<div id="container_@id@" class="div-blogentryitem-container"><table class="blogEntryItemMainTable"><tr><td><div style="" class="blog-item-textarea" id="p_@id@"><br/></div></td><td><div id="clipboard_@id@" class="blog-item-clipboard" style="display:none;position:absolute;">Clipboard</div><img style="" class="blog-item-image" src="Images/add_image.png"id="img_@id@" /></td></tr></table><input type="file" id="file_@id@" style="display: none;" /><input type="button" id="discard_@id@"  value="X" class="button-discard button-discard-paragraph-image  button-normal" /></div>',
            imageParagraph: '<div id="container_@id@" class="div-blogentryitem-container"><table class="blogEntryItemMainTable"><tr><td><div id="clipboard_@id@" class="blog-item-clipboard" style="display:none;position:absolute;">Clipboard</div><img class="blog-item-image" style="" src="Images/add_image.png"id="img_@id@" /></td><td><div style=""class="blog-item-textarea" id="p_@id@"><br/></div></td></tr></table><input type="file" id="file_@id@" style="display:none;" /><input type="button" id="discard_@id@" value="X" class="button-discard button-discard-image-paragraph button-normal " /></div>'
        },

        getItemType: function (id, itemType) {
            switch (itemType) {
                case "paragraph":
                    return this.paragraph(id);
                case "image":
                    return this.image(id);
                case "paragraphImage":
                    return this.paragraphImage(id);
                case "imageParagraph":
                    return this.imageParagraph(id);
                default:
                    return this.paragraph(id);
            }
        },
        paragraph: function (id) {
            var con = $(BlogEntryItem.prototype._itemTypes._html.paragraph.replace(new RegExp('@id@', 'g'), id));
            var para = con.find('.blog-item-textarea');
            var discard = con.find('input:button');
            setTimeout(function () {
                discard.addClass('button-discard-paragraph');
            }, 100);
            return {
                container: con,
                type: 'paragraph',
                paragraph: para,
                discard: discard
            }
        },
        image: function (id) {
            var con = $(BlogEntryItem.prototype._itemTypes._html.image.replace(new RegExp('@id@', 'g'), id));
            var img = con.find('img');
            var file = con.find('input:file');
            var discard = con.find('input:button');
            var clipboard = con.find('.blog-item-clipboard');
            return {
                container: con,
                type: 'image',
                image: img,
                fileUpload: file,
                discard: discard,
                clipboard: clipboard
            }
        },
        paragraphImage: function (id) {
            var con = $(BlogEntryItem.prototype._itemTypes._html.paragraphImage.replace(new RegExp('@id@', 'g'), id));
            var img = con.find('img');
            var file = con.find('input:file');
            var para = con.find('.blog-item-textarea');
            var discard = con.find('input:button');
            var clipboard = con.find('.blog-item-clipboard');
            return {
                container: con,
                type: 'paragraphImage',
                image: img,
                paragraph: para,
                fileUpload: file,
                discard: discard,
                clipboard: clipboard
            }
        },
        imageParagraph: function (id) {
            var con = $(BlogEntryItem.prototype._itemTypes._html.imageParagraph.replace(new RegExp('@id@', 'g'), id));
            var img = con.find('img');
            var file = con.find('input:file');
            var para = con.find('.blog-item-textarea');
            var discard = con.find('input:button');
            var clipboard = con.find('.blog-item-clipboard');
            return {
                container: con,
                type: 'imageParagraph',
                paragraph: para,
                image: img,
                fileUpload: file,
                discard: discard,
                clipboard: clipboard
            }
        }
    }
}





