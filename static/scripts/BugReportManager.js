/**
 * Created by Akhil Sekharan on 2/11/14.
 */

function BugReportManager(config, parentObject){
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.erp = parentObject;
    self.initialize();
    return self;
}

BugReportManager.prototype = {
    constants:{
        container: {
            "class": "bug-report-container"
        }
    },
    selectors:{
        bugReportType: "#bugReportType",
        bugReportMainContainer: "#bugReportMainContainer",
        bugReportModule: "#bugReportModule",
        bugReportSubModule: "#bugReportSubModule",
        moduleNameTr: "#moduleNameTr",
        bugSeverityLevel: "#bugSeverityLevel",
        bugSeverityLevelTr: "#bugSeverityLevelTr",
        reportSubject: "#reportSubject",
        reportContent: "#reportContent",
        sendBugReport: "#sendBugReport",
        cancelBugReport: "#cancelBugReport"
    },
    initialize: function(){
        var self = this;
        self.elements = {};
        self.createElements().bindEvents();
        self.hide();
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);

        self.container = $(self.config.container).attr(self.constants.container);
        var elements = {};
        elements.container = self.container;
        elements.bugReportType = self.container.find(self.selectors.bugReportType);
        elements.bugReportMainContainer = self.container.find(self.selectors.bugReportMainContainer);
        elements.bugReportModule = self.container.find(self.selectors.bugReportModule);
        elements.bugReportSubModule = self.container.find(self.selectors.bugReportSubModule);
        elements.moduleNameTr = self.container.find(self.selectors.moduleNameTr);
        elements.bugSeverityLevel = self.container.find(self.selectors.bugSeverityLevel);
        elements.bugSeverityLevelTr = self.container.find(self.selectors.bugSeverityLevelTr);
        elements.reportSubject = self.container.find(self.selectors.reportSubject);
        elements.reportContent = self.container.find(self.selectors.reportContent);
        elements.sendBugReport = self.container.find(self.selectors.sendBugReport);
        elements.cancelBugReport = self.container.find(self.selectors.cancelBugReport);
        self.elements = elements;

        var options = [];
        self.erp.forEachModule(function(module){
            var option = document.createElement('option');
            option.innerHTML = module.displayName;
            option.value = module.id;
            options.push(option);
        });
        self.elements.bugReportModule.append(options);
        return self;
    },
    bindEvents: function(){
        var self = this;
        self.elements.bugReportType.on('change',function(){
            if(self.elements.bugReportType.val() == 'bug'){
                self.elements.moduleNameTr.removeClass('hidden');
                self.elements.bugSeverityLevelTr.removeClass('hidden');
                self.elements.bugReportModule.trigger('change')
            }else{
                self.elements.moduleNameTr.addClass('hidden');
                self.elements.bugSeverityLevelTr.addClass('hidden');
            }
        });
        self.elements.bugReportModule.on('change',function(){
            var selectedModuleId = self.elements.bugReportModule.val();
            self.elements.bugReportSubModule.empty();
            if( selectedModuleId){
                self.elements.bugReportSubModule.append(self.parentObject.modules[selectedModuleId].getSubModulesListAsSelectOptions())
            }
        });
        self.elements.cancelBugReport.on('click', function(){
            self.hide();
        });
        self.elements.sendBugReport.on('click', function(){
            if(self.sendBugReport()){
                self.erp.notifier.showSuccessNotification('Thank you for your feedback. We will get back to yo soon');
                self.hide();
            }
        });
//        self.elements.container.draggable({
//            containment: document.body,
//            handle: ".bug-report-elements-header"
//        });
    },
    sendBugReport: function(){
        var self = this;
        var data = self.getFormData();
        if(!data){
            return false;
        }

        $.ajax({
            url:'http://endasys.com/sendBugReport',
            type:'get',
            data: data
        }).done(function(receivedData){
            if(receivedData.success){
                self.erp.notifier.showSuccessNotification('Thank you for using our support. We will get back to you soon');
            }
        });

        var supportSubmutData = {};
        supportSubmutData.config = {};
        supportSubmutData.config.moduleName = data.module;
        supportSubmutData.config.subject = data.reportSubject;
        supportSubmutData.config.message = data.content;
        supportSubmutData.config.applicationId = self.erp.id;
        supportSubmutData.config.reportedDate = moment().format('YYYY-MM-DD');
        supportSubmutData.config.reportedTime = moment().format('h:mm:ss');
        supportSubmutData.config.status = 'new';
        supportSubmutData.config.application = self.erp.displayName;

        var supportSubmutDataUrl = 'http://192.168.1.250:12051/api/public/insertBugReport';

        $.ajax({
            'type':'post',
            'url':supportSubmutDataUrl,
            'data':supportSubmutData
        });
		
        return true;
    },
    getFormData: function(){
        var self = this;
        var data = {};

        data.application = self.erp.displayName;
        data.module = self.elements.bugReportModule.val();
        data.reportSubject = self.elements.reportSubject.val();
        data.content = self.elements.reportContent.val();
        for(var key in data){
            if(data[key] && !data[key].length){
                self.parentObject.notifier.showErrorNotification('All fields are mandatory');
                return null;
            }
        }
        return data;
    },
    show: function(data){
        var self = this;
        self.resetFormData();
        self.container.show();
        if(data){
            self.setFormData(data);
        }
        setTimeout(function(){
            self.elements.bugReportMainContainer.addClass('bug-report-shown');
            self.elements.container.find('.ourTechnologies').css({"display":"block"});
            self.elements.container.find('.supportAddressContainer').css({"display":"block"});
            self.elements.container.find('.technicalSupportImage').css({"display":"block"});

        },0);
        return self;
    },
    setFormData: function(formData){
        var self = this;
        self.elements.bugReportType.val(formData.type).trigger('change');
        if(formData.type == 'bug'){
            self.elements.bugReportModule.val(formData.module).trigger('change');
            self.elements.bugReportSubModule.val(formData.subModule);
            self.elements.bugSeverityLevel.val(formData.bugSeverityLevel);
        }
        self.elements.reportSubject.val(formData.subject);
        self.elements.reportContent.val(formData.content);
        return self;
    },
    resetFormData: function(){
        var self = this;
        self.container.find('textarea,input').val(null);
        return self;
    },
    hide: function(){
        var self = this;
        self.elements.bugReportMainContainer.removeClass('bug-report-shown');
        setTimeout(function(){
            self.container.hide();
        }, 100);
        return self;
    },
    _creation: {
        createElements: function(bugReportManager){
            var self= this;
            return self;
        }
    }
}

BugReportManager.prototype.socketEvents = {
    sendBugReport: "sendBugReport",
    sendBugReportDone: "sendBugReportDone"
}