FormView = function (blog) {
    this.blog = blog;
    this.initialize();
    return this;
}

FormView.prototype = {
    _selectors: {
        container: '#divFormViewContainer',
        workspace: '#divWorkspace',
        divParentBlogEntryInfoContainer: '#divParentBlogEntryInfoContainer',
        spanParentBlogEntryTitle: '#spanParentBlogEntryTitle',
        txtBlogEntryTitle: '#txtBlogEntryTitle',
        btnAddParagraph: '#btnParagraph',
        btnAddImage: '#btnImage',
        btnParagraphImage: '#btnParagraphImage',
        btnImageParagraph: '#btnImageParagraph',
        btnSubmit: '#btnSubmit',
        btnDiscard: '#btnDiscard',
        btnReorder: "#btnReorder",
        btnResize: "#btnResize",
        btnPanel: "#divAddButtonPanel"
    },
    initialize: function () {
        var formView = this;
        this._modes.formView = this;
        this._screen.formView = this;
        // this.toolBox = new ToolBox();
        // this.toolBox.initialize(this);
        this.container = $(this._selectors.container);
        this.btnPanel = this.container.find(this._selectors.btnPanel);
        this.workspace = this.container.find(this._selectors.workspace);
        this.divParentBlogEntryInfoContainer = this.container.find(this._selectors.divParentBlogEntryInfoContainer);
        this.spanParentBlogEntryTitle = this.divParentBlogEntryInfoContainer.find(this._selectors.spanParentBlogEntryTitle);
        this.txtBlogEntryTitle = this.container.find(this._selectors.txtBlogEntryTitle);
        this.buttons = {};
        this.buttons.btnAddParagraph = this.container.find(this._selectors.btnAddParagraph);
        this.buttons.btnAddParagraph.on('click', function () {
            if (!formView.isAddingMoreItemsAllowed()) {
                return;
            }
            formView.blogEntry.addItem(new BlogEntryItem(new Date().getTime(), 'paragraph', formView.blogEntry));
        });
        this.buttons.btnAddImage = this.container.find(this._selectors.btnAddImage);
        this.buttons.btnAddImage.on('click', function () {
            if (!formView.isAddingMoreItemsAllowed()) {
                return;
            }
            formView.blogEntry.addItem(new BlogEntryItem(new Date().getTime(), 'image', formView.blogEntry));
        });
        this.buttons.btnParagraphImage = this.container.find(this._selectors.btnParagraphImage);
        this.buttons.btnParagraphImage.on('click', function () {
            if (!formView.isAddingMoreItemsAllowed()) {
                return;
            }
            formView.blogEntry.addItem(new BlogEntryItem(new Date().getTime(), 'paragraphImage', formView.blogEntry));
        });
        this.buttons.btnImageParagraph = this.container.find(this._selectors.btnImageParagraph);
        this.buttons.btnImageParagraph.on('click', function () {
            if (!formView.isAddingMoreItemsAllowed()) {
                return;
            }
            formView.blogEntry.addItem(new BlogEntryItem(new Date().getTime(), 'imageParagraph', formView.blogEntry));
        });
        this.buttons.btnSubmit = this.container.find(this._selectors.btnSubmit);
        this.buttons.btnSubmit.on('click', function () {
            formView.save();
        });
        this.buttons.btnDiscard = this.container.find(this._selectors.btnDiscard);
        this.buttons.btnDiscard.on('click', function () {
            formView.hide();
        });
        this.buttons.btnReOrder = this.container.find(this._selectors.btnReorder);
        this.buttons.btnReOrder.on('click', function () {
            var button = $(this);
            if (button.prop('reordermode')) {
                button.attr('value', 'Reorder');
                formView.reorderMode(false);
                button.prop('reordermode', false);
            }
            else {
                button.attr('value', 'Finish Reorder');
                formView.reorderMode(true);
                button.prop('reordermode', true);
            }
        });
        this.buttons.btnResize = this.container.find(this._selectors.btnResize);
        this.buttons.btnResize.on('click', function () {
            var button = $(this);
            if (button.prop('resizemode')) {
                button.attr('value', 'Resize');
                formView.resizeMode(false);
                button.prop('resizemode', false);
            }
            else {
                button.attr('value', 'Finish Resize');
                formView.resizeMode(true);
                button.prop('resizemode', true);
            }
        });
        this.container.find('#divFormView').draggable({ handle: "#divButtonPanel" });
    },
    isAddingMoreItemsAllowed: function () {
        if (Object.keys(this.blogEntry.items).length >= 5) {
            return false;
        }
        return true;
    },
    resizeMode: function (enable) {
        var formView = this;
        var blogEntryItems = formView.blogEntry.container.find('[contenteditable],img');
        if (enable) {
            blogEntryItems.resizable({ containment: '.blog-entry', handles: 's' });
            blogEntryItems.resizable('enable');
            //            blogEntryItemContainers.find( 'p.blog-item-textarea' ).resizable( { handles: 's' } );
            //            blogEntryItemContainers.find( 'p.blog-item-textarea' ).resizable( 'enable' );
            //blogEntryItemContainers.css( { border: '1px royalblue dashed', marginBottom: '5px'} );
            formView.container.find('.button-normal:not(#btnResize),.button-image,#divParagraph').hide();
        }
        else {
            blogEntryItems.resizable('disable');
            //            blogEntryItemContainers.find( 'p.blog-item-textarea' ).resizable( 'disable' );
            //            blogEntryItemContainers.find( 'p.blog-item-textarea' ).css( { border: '', marginBottom: 'none' } );
            //blogEntryItems.css( { border: 'none', marginBottom: 'none' } );
            formView.container.find('.button-normal,.button-image,#divParagraph').show();
        }
    },
    reorderMode: function (enable) {
        var formView = this;
        if (enable) {
            formView.blogEntry.container.sortable();
            formView.blogEntry.container.sortable('enable');
            formView.blogEntry.container.find('.div-blogentryitem-container').css({ border: '1px royalblue dashed' });
            formView.container.find('.button-normal:not(#btnReorder),.button-image').hide();
        }
        else {
            formView.blogEntry.container.sortable('disable');
            formView.blogEntry.container.find('.div-blogentryitem-container').css({ border: 'none' });
            formView.container.find('.button-normal,.button-image').show();
        }
    },
    show: function (mode, blogEntry, showOptions) {
        this.container.show().find('.blog-entry').remove();
        this.showOptions = showOptions || {};
        // this._screen.stretch(this.container);
        // _ui.setToCenterOfParent(this.container.find('#divFormView'), window);
        // this.container.find('#divFormView').css({ top: "100px" });
        // this.toolBox.hide();


        if(this.showOptions.parentBlogEntry){
            this.spanParentBlogEntryTitle.text(this.showOptions.parentBlogEntry.title);
            this.divParentBlogEntryInfoContainer.show();
        }
        else{
            this.spanParentBlogEntryTitle.text('');
            this.divParentBlogEntryInfoContainer.hide();
        }

        switch (mode) {
            case 'create':
                this._modes.showCreateMode();
                break;
            case 'edit':
                this._modes.showEditMode(blogEntry);
        }
    },
    hide: function (refreshData) {
        this.container.hide().find('.blog-entry').remove();
        self.showOptions = {};
        if(refreshData){
            blog.getData();
        }
    },
    cancel: function () {
        this.hide();
    },
    save: function () {
        this.blogEntry.container.find('[contenteditable],img').css({ border: '' });
        var obj = this._config.blogEntryToSerializedObject(this.blogEntry, this);
        if (obj.errors) {
            this.showErrors(obj.errors);
            return;
        }
        
        if (this.createMode) {
            this._config.insertBlogEntry(obj, this);
            // if (window.parentSubModuleConfig.emailConfig) {
            //
            //     var html = '';
            //     $('#divWorkspace').find('.blog-item-textarea').each(function () {
            //         html += $(this).html() + '\n';
            //     });
            //
            //     var valueData = app.getSelectedModule().editData;
            //     var textData = app.getSelectedModule().formattedViewData;
            //     var mailingListSetting = app.settings['Email_MailingList'].replace(/\n/g, '%0A').replace(/@pc@/g, '%');
            //     var mailingLists = JSON.parse(decodeURIComponent(mailingListSetting));
            //     var mailingList = findObjectInArray(mailingLists, 'name', window.parentSubModuleConfig.emailConfig.name)[0];
            //
            //     _email._blogView.sendEmail(blog.rowId, mailingList, valueData[blog.rowId], textData[blog.rowId], html);
            // }

        }
        else
            this._config.updateBlogEntry(obj, this);



    },
    _modes: {
        showCreateMode: function () {
            this.formView.createMode = true;
            this.formView.editMode = false;
            this.formView.blogEntry = new BlogEntry();
            this.formView.workspace.append(this.formView.blogEntry.container);
            this.formView.blogEntry.formView = this.formView;
            this.formView.btnPanel.show();

            this.formView.txtBlogEntryTitle.val('');
        },
        showEditMode: function (blogEntry) {
            this.formView.createMode = false;
            this.formView.editMode = true;
            this.formView.blogEntry = blogEntry;
            this.formView.blogEntry.showEditMode();
            this.formView.workspace.append(this.formView.blogEntry.container);
            this.formView.blogEntry.formView = this.formView;
            this.formView.btnPanel.hide();

            this.formView.txtBlogEntryTitle.val(blogEntry.config.title);
        }
    },
    _screen: {
        stretch: function (element, stretchToDocument) {
            var doc = $(document);
            element.css({ width: doc.width(), height: doc.height() });
        }
    },
    enableDisableSubmit: function (disable) {
        this.disableSubmit = disable;
        if (disable)
            $(this._selectors.btnSubmit).prop('disabled', disable).hide();
        else
            $(this._selectors.btnSubmit).prop('disabled', disable).show();
    },
    showErrors: function (arr) {
        var self = this;
        for (var key in arr) {
            var item = arr[key];
            this.blogEntry.container.find('#' + item.id).css({ border: '1px solid red' });

            if(item.type == 'title'){
                self.txtBlogEntryTitle.css('border', '1px solid red');
                setTimeout(function () {
                    self.txtBlogEntryTitle.css('border', '');
                }, 1500);
            }
        }
    },
    _config: {
        blogEntryToSerializedObject: function (blogEntry, formView) {
            var arr = [];
            var errors = [];
            for (var key in blogEntry.items) {
                var obj = {};
                var item = blogEntry.items[key];
                obj.type = item.type;
                if (item.paragraph) {
                    var content = '';
                    tinyMCE.editors.forEach(function (tinyMceEditor) {
                        if(tinyMceEditor.getElement().attributes['data-temp-id'].value == item.paragraph.attr('data-temp-id')){
                            content = tinyMceEditor.getContent();
                        }
                    });

                    if (!content.length) {
                        var temp = {};
                        temp.type = 'paragraph';
                        temp.id = item.paragraph.attr('id');
                        errors.push(temp);
                    }
                    else {
                        obj.content = content;
                    }
                }
                if (item.image) {
                    if (!item.fileUpload.get(0).files.length && !item.fileUpload.data('clipboard')) {
                        if (blogEntry.formView.editMode && !item.fileUpload.prop('changed')) {
                            obj.image = JSON.parse(item.configuration).image;

                        }
                        else {
                            var temp = {};
                            temp.type = 'image';
                            temp.id = item.image.attr('id');
                            errors.push(temp);
                        }
                    }
                    else if (item.fileUpload.data('clipboard')) {
                        obj.image = item.fileUpload.data('clipboard');
                    }
                    else {
                        obj.image = item.fileUpload.get(0).files[0].name;
                    }

                    obj.image = item.image.data('imageInfo');
                    obj.image.randomFileName = item.fileUpload.data('fileUploadResult').randomFileName;

                }
                //obj.image = encodeURIComponent(obj.image)
                //console.log(obj.image);

                obj.oldBlogEntryItemId = item.blogEntryItemId;
                obj.index = blogEntry.container.find('.div-blogentryitem-container').index(item.container)
                arr.push(obj);
            }

            var title = formView.txtBlogEntryTitle.val().trim();
            if(!title){
                errors.push({
                    type : 'title'
                });
            }

            if (errors.length){
                return {
                    errors : errors
                };
            }

            if(!arr.length){
                return {
                    errors : []
                };
            }

            return {
                items : arr,
                title : title
            };
            // var xmlObject = new XMLObject(arr, '', true);
            // return xmlObject.toString();
        },
        insertBlogEntry: function (obj, formView) {
            var blog = formView.blog;

            var data = {
                parentRowId: blog.parentRowId,
                title: obj.title,
                items: JSON.stringify(obj.items)
            };

            // console.log('insert data', data);

            if(formView.showOptions.parentBlogEntry){
                data.parentBlogEntryId = formView.showOptions.parentBlogEntry.blogEntryId;
            }


            var url = '/blog/@blogUniqueId@/InsertToBlog';
            url = url.replace('@blogUniqueId@', blog.parentColumnUniqueId)
            $.ajax({
                type: 'POST',
                url: url,
                data: data
            }).always(function (result) {
                console.log('received insert result', result)
                formView.hide(true);
            });

        },
        updateBlogEntry: function (data, formView) {
            var req = new CustomXMLHttpRequest('POST', Server.DataServiceUrl, true);
            var form = [];
            form.push("Rows_Id=" + blog.rowId);
            form.push("BlogEntries_Id=" + formView.blogEntry.blogEntryId);
            form.push("Data=" + data);
            form.push("Type=UpdateBlogEntry");
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    //console.log( req.responseText );
                    formView.hide();
                }
            }
            req.send(form.join('&'));
        }
    }
}