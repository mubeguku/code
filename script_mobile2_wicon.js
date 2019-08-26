(function($){

    //console.log('v=1.1.1');

    var wait = setInterval(function(){
        if ( $('.site-logo-wrapper').length > 0 && $('.cxl-benefits-container').length < 1 ) {
            run_all();
        }

    }, 250);

    function run_all() {

        var css =
            '.cxl-orange {'+
            'top: 0!important;'+
            'margin-left: 0!important;'+
            '}'+
            'header.site-header {'+
            'border-bottom: none;'+
            '}'+
            '.cxl-hamburger-icon {'+
            'width: 30px;'+
            'position: absolute;'+
            'top: 18px;'+
            'right: 16px;'+
            '}'+
            '.cxl-hamburger-icon span {'+
            'height: 5px;'+
            'background-color: #044d80;'+
            'margin: 4px 0;'+
            'width: 100%;'+
            'display: block;'+
            'border-radius: 2.5px;'+
            '}'+
            '.cxl-hamburger-icon.active span {'+
            'background: #63c1ea;'+
            '}'+
            '.site-header-content .cell.three-quarters.lap-three-quarters.palm-one-whole.float-right {'+
            'position: absolute;'+
            'top: 50px;'+
            'background: white;'+
            'width: 100%;'+
            'box-sizing: border-box;'+
            'padding: 0 14px 5px 0;'+
            'left: 0;'+
            'border-bottom: 1px solid #e0e0e0;'+
            'box-shadow: 1px 2px 3px 0px #e0e0e0;'+
            '}'+
            '.cxl-benefits-container {'+
            'padding: 10px 19px 6px;'+
            'border-bottom: 1px solid #b2ccdb;'+
            '}'+
            '.cxl-benefits-container div {'+
            'margin-bottom: 4px;'+
            '}'+
            '.cxl-benefits-container img {'+
            'max-width: 17px;'+
            '}'+
            '.cxl-benefits-container span {'+
            'font-size: 14px;'+
            'font-weight: 600;'+
            'color: #044d80;'+
            'display: inline-block;'+
            'margin-left: 7px;'+
            'position: relative;'+
            'top: -3px;'+
            '}'+
            '.stack.directory-header.base-margin-bottom {'+
            'position: relative;'+
            '}'+
            'span.cxl-close-icon {'+
            'position: absolute;'+
            'top: 0;'+
            'right: 0;'+
            'padding: 10px;'+
            'line-height: 1;'+
            'font-size: 21px;'+
            '}'+
            '.stack.directory-header.base-margin-bottom .stack-content {'+
            'padding-top: 12px;'+
            '}'+
            '.stack.directory-header.base-margin-bottom .stack-content h1 {'+
            'margin-bottom: 2px;'+
            '}'+
            'a.cxl-show-text {'+
            'font-size: 13px;'+
            'width: 100%;' +
            'text-align: center;' +
            'display: inline-block;' +
            'text-decoration: underline;' +
            '}'+
            '.cell.three-fifths.lap-one-whole.palm-one-whole.base-padding-top.base-padding-bottom {'+
            'padding-top: 0;'+
            'padding-bottom: 20px;'+
            '}'+
            'div#sem-landing-page-original .stack-content {'+
            'padding-top: 0!important;'+
            '}'+
            '.sem-listing:first-child {'+
            'border-top: none;'+
            'padding-top: 0;'+
            '}'+
            '.stack.directory-header.base-margin-bottom .stack-content h2 {'+
            'font-size: 14px;'+
            'margin-top: 10px;'+
            'text-align: center;'+
            '}'
        ;

        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        $(
            '<div class="cxl-benefits-container">'+
            '<div><img src="https://cdn.optimizely.com/img/165817466/f19cd17671f343089d9dc51692097772.png"><span>700+ products</span></div>'+
            '<div><img src="https://cdn.optimizely.com/img/165817466/0c74f41952384557882b0afdedc9e537.png"><span> 825,000+ verified user reviews</span></div>'+
            '</div>'
        ).insertBefore('.site-main');

        $('.stack.directory-header.base-margin-bottom .stack-content h2').hide();
        var h1_text = $('.stack.directory-header.base-margin-bottom .stack-content h1').text();
        $('<a href="#" class="cxl-show-text" id="mobile-expand-content"><span id="mobile-expand-sign">+</span> What is ' + h1_text + '?</a><span class="cxl-close-icon" style="display: none;">×</span>').insertBefore('.stack.directory-header.base-margin-bottom .stack-content h2');
        $('.cxl-show-text').click(function() {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $('#mobile-expand-sign').text('-');
                $('.stack.directory-header.base-margin-bottom .stack-content h2').show();
            } else {
                $(this).removeClass('active');
                $('#mobile-expand-sign').text('+');
                $('.stack.directory-header.base-margin-bottom .stack-content h2').hide();
            }
            //$(this).hide();
            //$('.stack.directory-header.base-margin-bottom .stack-content h2').show();
            //$('.cxl-close-icon').show();
        });

        $('.cell.three-quarters.lap-three-quarters.palm-one-whole.float-right').hide();
        $('.cxl-hamburger-icon').click(function(){
            $('.cell.three-quarters.lap-three-quarters.palm-one-whole.float-right').toggle();
            $(this).toggleClass('active');
        });

        var desc_el = $('.stack.directory-header.base-margin-bottom .stack-content h2');
        var path = document.location.pathname;

        if ( path.indexOf('/remote-support-software') > -1 ) {
            desc_el.text('Remote Support software helps companies provide remote technical support with screen sharing, text chat, online meetings, and training tools.');
        } else if ( path.indexOf('/payment-processing-software') > -1 ) {
            desc_el.text('Payment Processing software enables organizations of varying sizes to process credit card payments via the internet or traditional point of sale (POS) interfaces.');
        } else if ( path.indexOf('/document-management-software') > -1 ) {
            desc_el.text('Document Management software automates the process of managing documents from creation to storage to distribution throughout an enterprise, increasing efficiency and reducing the cost and clutter of maintaining paper records.');
        } else if ( path.indexOf('/inside-sales-software') > -1 ) {
            desc_el.text('Inside Sales software encompasses solutions that streamline the tasks involved in direct sales processes and includes a variety of power dialer applications, from predictive to progressive to voice messaging dialers.');
        } else if ( path.indexOf('/knowledge-management-software') > -1 ) {
            desc_el.text('Knowledge Management software offers ways to optimize the utility of intellectual capital and intangible assets by capturing, preserving and organizing institutional knowledge in a measurable format.');
        } else if ( path.indexOf('/survey-software') > -1 ) {
            desc_el.text('Survey software enables the efficient design and management of electronic surveys, polls and questionnaires for market research, measuring customer satisfaction and collecting employee feedback, along with many other applications.');
        } else if ( path.indexOf('/lead-capture-software') > -1 ) {
            desc_el.text('Lead Capture software helps event managers, marketers, and sales representatives to automatically collect, verify, classify, and organize contact and behavioral information about their potential customers.');
        } else if ( path.indexOf('/budgeting-software') > -1 ) {
            desc_el.text('Budgeting software automates the coordination of an organization\'s financial resources and expenditures.');
        } else if ( path.indexOf('/team-communication-software') > -1 ) {
            desc_el.text('Team Communication software helps members of a team or a project to communicate efficiently among themselves.');
        } else if ( path.indexOf('/it-service-software') > -1 ) {
            desc_el.text('IT Service software helps IT service providers to sell, implement, deliver and bill their services by automating field services and technician management.');
        } else if ( path.indexOf('/appointment-scheduling-software') > -1 ) {
            desc_el.text('Appointment Scheduling software streamlines the process of scheduling clients, patients, and meetings.');
        } else if ( path.indexOf('/law-practice-management-software') > -1 ) {
            desc_el.text('Law Practice Management software integrates and automates the front and back office activities of legal practices including: calendaring, appointment scheduling, case management, conflict checking, messaging and more.');
        } else if ( path.indexOf('/reporting-software') > -1 ) {
            desc_el.text('Reporting tools allow real-time access to essential data as well as the rapid generation of multidimensional reports from diverse data sources.');
        } else if ( path.indexOf('/time-clock-software') > -1 ) {
            desc_el.text('Time Clock software, also known as timesheet software, automates the tracking of employee attendance, scheduling and vacations.');
        } else if ( path.indexOf('/business-intelligence-software') > -1 ) {
            desc_el.text('Business Intelligence software enables companies to access, analyze and share information in order to improve decision-making through gathering performance metrics.');
        } else if ( path.indexOf('/salon-software') > -1 ) {
            desc_el.text('Salon software automates and manages salon and spa operations.');
        } else if ( path.indexOf('/digital-asset-management-software') > -1 ) {
            desc_el.text('Digital Asset Management software automates the management of images and other non-textual materials.');
        } else if ( path.indexOf('/scheduling-software') > -1 ) {
            desc_el.text('Scheduling software automates the scheduling of events, employees, rooms and other resources.');
        } else if ( path.indexOf('/performance-appraisal-software') > -1 ) {
            desc_el.text('Performance Appraisal software automates the process of reviewing employee performance, setting new objectives and writing individual development plans.');
        } else if ( path.indexOf('/maintenance-management-software') > -1 ) {
            desc_el.text('Maintenance Management software automates the tracking and scheduling of maintenance activities, enabling services organizations to operate proactively while reducing downtime and increasing operating efficiency.');
        } else if ( path.indexOf('/work-order-software') > -1 ) {
            desc_el.text('Work Order software often comes as a feature or an add on to more comprehensive Field Service Management, Service Dispatch, and Maintenance Management software systems.');
        } else if ( path.indexOf('/hvac-software') > -1 ) {
            desc_el.text('HVAC software automates service management for heating, ventilation and air conditioning contractors.');
        } else if ( path.indexOf('/billing-and-invoicing-software') > -1 ) {
            desc_el.text('Billing and Invoicing software automates the process of producing and sending invoices and receiving payments.');
        } else if ( path.indexOf('/it-management-software') > -1 ) {
            desc_el.text('IT Management software provides the tools and process for controlling and monitoring computer networks, including: operating systems, applications, network devices, security measures, mainframes, access control systems, web services and databases.');
        } else if ( path.indexOf('/inventory-management-software') > -1 ) {
            desc_el.text('Inventory Management software monitors inventory levels for optimal production and distribution of goods for wholesale or retail.');
        } else if ( path.indexOf('/community-software') > -1 ) {
            desc_el.text('Community software allows businesses to connect with their customers by creating a space for sharing ideas, collecting opinions, storing Q&A data, and interacting with fellow customers and business representatives.');
        } else if ( path.indexOf('/business-management-software') > -1 ) {
            desc_el.text('Business Management software brings together in single suite applications for Accounting, Contact Management, Customer Relationship Management, Enterprise Resource Planning and Human Resource.');
        } else if ( path.indexOf('/recruiting-software') > -1 ) {
            desc_el.text('Recruiting software helps recruiting, staffing and hiring agencies manage their operations by maintaining a database of applicant and job information.');
        } else if ( path.indexOf('/employee-scheduling-software') > -1 ) {
            desc_el.text('Employee Scheduling software helps businesses organize and manage personnel\'s schedules.');
        } else if ( path.indexOf('/product-roadmap-software') > -1 ) {
            desc_el.text('Product Roadmap software helps product managers and developers plan project timelines, document project goals, and manage the product lifecycle.');
        } else if ( path.indexOf('/product-configurator-software') > -1 ) {
            desc_el.text('Product Configurator software automates the configuration of build-to-order products with multiple options.');
        } else if ( path.indexOf('/training-software') > -1 ) {
            desc_el.text('Training software, also known as eLearning or Computer-Based Training (CBT) software, automates educational activities for students and/or corporate employees.');
        } else if ( path.indexOf('/event-management-software') > -1 ) {
            desc_el.text('Event Management software automates marketing, registration, coordination and scheduling of events.');
        } else if ( path.indexOf('/itsm-software') > -1 ) {
            desc_el.text('ITSM software, also known as Information Technology Service Management software, focuses on management of internal and external IT support.');
        } else if ( path.indexOf('/customer-service-software') > -1 ) {
            desc_el.text('Customer Service software enables an organization to manage and track customer relationships and support services.');
        } else if ( path.indexOf('/workflow-management-software') > -1 ) {
            desc_el.text('Workflow Management software coordinates the flow of work and ensures changes are properly implemented.');
        } else if ( path.indexOf('/quality-management-software') > -1 ) {
            desc_el.text('Quality Management software automates the process of tracking and minimizing product defects.');
        } else if ( path.indexOf('/attendance-tracking-software') > -1 ) {
            desc_el.text('Attendance Tracking software helps organizations manage the whereabouts of their employees.');
        } else if ( path.indexOf('/manufacturing-software') > -1 ) {
            desc_el.text('Manufacturing software helps busy manufacturers meet customer demands with inventory control, quoting, forecasting, ordering, production, and QA tools.');
        } else if ( path.indexOf('/employee-engagement-software') > -1 ) {
            desc_el.text('Employee Engagement software aims to assist managers with maintaining employee awareness of corporate culture and increasing their level of investment in the company.');
        } else if ( path.indexOf('/inventory-control-software') > -1 ) {
            desc_el.text('Inventory Control software automates the management and tracking of goods and often includes tools such as bar code software.');
        } else if ( path.indexOf('/360-degree-feedback-software') > -1 ) {
            desc_el.text('360 Degree Feedback software is designed to help human resource departments gather all-around information about an employee.');
        } else if ( path.indexOf('/proposal-management-software') > -1 ) {
            desc_el.text('Proposal Management software helps companies manage the proposal and RFP process.');
        } else if ( path.indexOf('/student-information-system-software') > -1 ) {
            desc_el.text('Student Information System software helps educational institutions automate assignment distribution, grading, and other communications with students and their parents. This software also serves as a repository of documents related to students\' tenure at an institution.');
        } else if ( path.indexOf('/gradebook-software') > -1 ) {
            desc_el.text('Gradebook software automates grade tracking, performance assessment and monitoring of student attendance and provides easy access to synchronized data for teachers, principals and school administrators.');
        } else if ( path.indexOf('/event-check-in-software') > -1 ) {
            desc_el.text('Event Check In software helps significantly speed up the check in process at conferences, performances, and other events. This type of software can be deployed on mobile devices, such as smartphones and tablets, as well as kiosks, and often provides badge printing capabilities. Many organizations use Event Check In software to capture attendee information for lead generating purposes.');
        }

    }

})(jQuery);

(function($){

    //console.log('v=1.1.1');

    var wait=setTimeout(function(){
        if ( $('.cxl-benefits-container').length >-1 ) {
            run_all();
        }else{
            wait();
        }

    }, 250);

    function numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    function run_all() {


//newStuff

        var urls=['360-degree-feedback','3d-architecture','3d-cad','ab-testing','aml','api-management','account-based-marketing','accounting','accounting-practice-management','accounts-payable','accounts-receivable','accreditation-management','ad-server','admissions','advertising-agency','advocacy','affiliate','agile-project-management-tools','airline-reservation-system','alumni-management','android-kiosk','animal-shelter','anti-spam','app-design','apparel-management','applicant-tracking','application-development','application-lifecycle-management','application-performance-management','appointment-reminder','appointment-scheduling','arborist','architectural-cad','architecture','archiving','art-gallery','artificial-intelligence','assessment','asset-tracking','assisted-living','association-management','attendance-tracking','auction','audience-response','audit','augmented-reality','authentication','auto-body','auto-dealer','auto-dealer-accounting','auto-dialer','auto-repair','automated-testing','aviation-maintenance','bim','background-check','backup','bakery','banking-systems','bankruptcy','bar-pos','barbershop','barcoding','benefits-administration','big-data','billing-and-invoicing','billing-and-provisioning','blockchain-platform','blog','board-management','bookkeeper','brand-management','brand-protection','brewery','budgeting','bug-tracking','building-maintenance','business-card','business-continuity','business-intelligence','business-management','business-performance-management','business-phone-systems','business-plan','business-process-management','cmdb','cmms','cpq','calibration-management','call-accounting','call-center','call-recording','call-tracking','camp-management','campaign-management','campground-management','car-rental','carpet-cleaning','catalog-management','catering','cemetery','change-management','channel-management','chemical','child-care','chiropractic','church-accounting','church-management','church-presentation','claims-processing','class-registration','classroom-management','click-fraud','clinical-trial-management','cloud-communication-platform','cloud-management','cloud-pbx','cloud-security','cloud-storage','club-management','coaching','code-enforcement','collaboration','commercial-insurance','commercial-loan','commercial-real-estate','commission','community','company-secretarial','compensation-management','competitive-intelligence','complaint-management','compliance','computer-repair-shop','computer-security','conference','conflict-checking','consignment','construction-accounting','construction-bid-management','construction-crm','construction-estimating','construction-management','construction-scheduling','contact-management','content-management','content-marketing','contest','continuous-integration','contract-management','contractor-management','convenience-store','conversational-ai-platform','conversational-marketing-platform','corporate-tax','corporate-wellness','corrective-and-preventive-action','courier','course-authoring','court-management','creative-management','credentialing','currency-exchange','customer-advocacy','customer-communications-management','customer-data-platform','customer-engagement','customer-experience','customer-journey-mapping-tools','customer-loyalty','customer-reference-management','customer-relationship-management','customer-satisfaction','customer-service','customer-success','cybersecurity','dance-studio','dashboard','data-analysis','data-center-management','data-discovery','data-entry','data-extraction','data-governance','data-loss-prevention','data-management','data-mining','data-quality','data-visualization','data-warehouse','database-management','debt-collection','decision-support','deep-learning','delivery-management','demand-planning','dental','dental-charting','dental-imaging','dermatology','devops','diagram','digital-adoption-platform','digital-asset-management','digital-rights-management','digital-signage','digital-signature','digital-workplace','disk-imaging','distribution','dock-scheduling','docketing','document-control','document-generation','document-management','document-version-control','donation-management','driving-school','dry-cleaning','eam','edi','ehs-management','ems','etl','electrical-contractor','electrical-design','electrical-estimating','electronic-data-capture','electronic-discovery','electronic-medical-records','email-archiving','email-management','email-marketing','email-security','email-signature','email-tracking','email-verification-tools','emergency-notification','emissions-management','employee-communication-tools','employee-engagement','employee-monitoring','employee-recognition','employee-scheduling','endpoint-protection','energy-management','engineering-cad','enterprise-architecture','enterprise-content-management','enterprise-resource-planning','enterprise-search','environmental','equipment-maintenance','equity-management','ergonomics','event-booking','event-check-in','event-management','event-marketing','exam','expense-report','facility-management','farm-management','fashion-design-and-production','fax-server','festival-management','field-service-management','file-sharing','file-sync','financial-crm','financial-fraud-detection','financial-management','financial-reporting','financial-risk-management','financial-services','fire-department','fitness','fixed-asset-management','fleet-maintenance','fleet-management','florist','flowchart','food-delivery','food-service-distribution','food-service-management','food-traceability','forestry','forms-automation','franchise-management','freight','fuel-management','fund-accounting','fundraising','funeral-home','gdpr-compliance','gis','gps-tracking','grc','game-development','gamification','gantt-chart','garage-door','garden-center','golf-course','government','gradebook','grant-management','graphic-design','guest-management','gymnastics','hoa','hr-analytics','hvac','hvac-estimating','handyman','healthcare-crm','heatmap','hedge-fund','help-desk','higher-education','home-builder','home-care','home-health-care','home-inspection','horse','hospice','hospital-management','hospitality-property-management','hostel-management','hotel-channel-management','human-resource','human-services','it-asset-management','it-management','it-project-management','it-service','itsm','ivr','iwms','idea-management','identity-management','image-analysis','image-recognition','incident-management','influencer-marketing','innovation','inside-sales','inspection','insurance-agency','insurance-policy','insurance-rating','integrated-risk-management','integration','intellectual-property-management','internal-communications','intranet','inventory-control','inventory-management','investigation-management','investment-management','iot','issue-tracking','jail-management','janitorial','java-cms','jewelry-store-management','job-board','job-costing','job-evaluation','job-shop','k-12','kanban-tools','kennel','key-management','kiosk','knowledge-management','laboratory-information-management-system','land-management','landing-page','landscape','law-enforcement','law-practice-management','lawn-care','lead-capture','lead-generation','lead-management','lead-nurturing','learning-analytics','learning-management-system','lease-accounting','lease-management','leave-management-system','legal-billing','legal-calendar','legal-case-management','legal-document-management','library-automation','license-management','link-management-tools','live-chat','load-balancing','loan-origination','loan-servicing','location-intelligence','locksmith','log-management','logbook','logistics','long-term-care','lost-and-found','mlm','mrm','mrp','msp','mac-crm','machine-learning','maid-service','mailroom-management','maintenance-management','manufacturing','manufacturing-execution','marine','market-research','marketing-analytics','marketing-attribution','marketing-automation','marketing-planning','marketplace','martial-arts','massage-therapy','master-data-management','medical-billing','medical-imaging','medical-inventory','medical-lab','medical-practice-management','medical-scheduling','medical-spa','medical-transcription','meeting','meeting-room-booking-system','membership-management','mental-health','mentoring','microlearning','mind-mapping','mining','mobile-analytics','mobile-banking','mobile-content-management-system','mobile-credit-card-processing','mobile-device-management','mobile-learning','mobile-marketing','mobility','mortgage-and-loans','moving','multi-channel-ecommerce','municipal','museum','music-school','network-mapping','network-monitoring','network-security','network-troubleshooting','nonprofit','nonprofit-accounting','nonprofit-crm','nursing-home','nutrition-analysis','nutritionist','ocr','oee','okr','occupational-therapy','oil-and-gas','onboarding','online-banking','online-crm','online-proofing','optometry','order-entry','order-management','org-chart','p&c-insurance','pacs','pci-compliance','pdf','pim','ppc','packaging','parcel-audit','parking-management','parks-and-recreation','password-management','patch-management','patient-case-management','patient-engagement','patient-management','patient-portal','pawn-shop','payment-processing','payroll','pediatric','performance-appraisal','performance-testing','permit','personal-trainer','personalization','pest-control','pet-grooming','pet-sitting','pharmacy','photo-booth','photography-studio','physical-security','physical-therapy','pilates-studio','plastic-surgery','plumbing','plumbing-estimating','podiatry','point-of-sale','policy-management','political-campaign','polling','pool-service','portal','pre-employment-testing','predictive-analytics','predictive-dialer','presentation','preventive-maintenance','pricing-optimization','print-estimating','privileged-access-management','procurement','product-configurator','product-data-management','product-lifecycle-management','product-management','product-roadmap','production-scheduling','productivity','professional-services-automation','project-management','project-planning','project-portfolio-management','project-tracking','proofreading','proposal-management','prototyping','public-relations','public-transportation','public-works','publishing-and-subscriptions','punch-list','purchasing','push-notifications','qualitative-data-analysis','quality-management','quoting','rdbms','rfp','radiology','real-estate-agency','real-estate-cma','real-estate-crm','real-estate-property-management','real-estate-transaction-management','recruiting','recruiting-agency','recurring-billing','recycling','reference-check','referral','registration','relocation','remodeling-estimating','remote-support','rental','rental-property-management','reporting','reputation-management','requirements-management','reservations','residential-construction-estimating','resource-management','restaurant-management','restaurant-pos','retail-management-systems','retail-pos-system','retargeting','revenue-management','review-management','risk-management','roofing','route-planning','seo','siem','sms-marketing','spc','saas-management','safety-management','sales-coaching','sales-enablement','sales-force-automation','sales-forecasting','sales-tax','salon','scheduling','scholarship-management','school-accounting','school-administration','school-bus-routing','scrum','security-system-installer','self-storage','server-backup','server-management','service-desk','service-dispatch','shipment-tracking','shipping','shopping-cart','simulation','single-sign-on','small-business-crm','small-business-loyalty-programs','small-business-ecommerce','social-crm-tools','social-media-analytics-tools','social-media-management','social-media-marketing','social-media-monitoring','social-networking','social-selling','social-work-case-management','softphone','source-code-management','sourcing','spa','space-management','speech-recognition','speech-therapy','sports-league','spreadsheet','staffing-agency','statistical-analysis','stock-portfolio-management','store-locator','strategic-planning','student-engagement-platform','student-information-system','subscription-management','succession-planning','supply-chain-management','survey','sustainability','swim-school','takeoff','talent-management','task-management','tattoo-studio','tax-practice-management','team-communication','telecom-expense-management','telemarketing','telemedicine','telephony','text-mining','ticketing','time-clock','time-tracking','time-and-expense','timeshare','tool-management','tour-operator','towing','trade-promotion-management','training','transactional-email','translation-management','transportation-dispatch','transportation-management','travel-agency','travel-management','treasury','trucking','trust-accounting','tutoring','ux','unified-communications','utility-billing','utility-management-systems','vpn','vr','vacation-rental','vector-graphics','vendor-management','venue-management','veterinary','video-editing','video-interviewing','video-making','video-management','video-marketing','virtual-data-room','virtual-machine','virtual-tour','virtualization','visitor-management','visual-search','voip','volunteer-management','voting','vulnerability-management','waitlist','waiver','warehouse-management','warranty-management','waste-management','web-analytics','web-conferencing','web-to-print','webinar','website-builder','website-monitoring','website-optimization-tools','winery','wireframe','wireless-expense-management','work-order','workflow-management','workforce-management','worship','yard-management','yoga-studio','zoo','eprescribing','ecommerce','elearning-authoring-tools','ipad-kiosk','ipad-pos'];

        var reviews=['3721','2345','2697','691','178','1932','3745','36016','16838','23713','21838','406','169','983','30107','650','978','20628','40','1018','461','10','903','2407','1787','21911','19520','7411','2872','5898','20343','15304','2537','5716','584','167','3040','673','4657','469','6701','17726','1575','501','2519','72','272','454','2744','2253','1637','1418','1712','249','1995','225','2624','3133','504','141','3989','6424','17939','8908','4357','47743','133','0','17562','1973','21326','2683','34','1820','23629','17630','3982','482','2320','8541','38156','10637','11197','331','24047','1075','7478','1801','1519','464','12214','3983','924','1273','17530','970','443','18131','1099','2259','67','980','2418','187','8256','6528','18900','10375','4469','2427','711','4397','200','1552','1987','8741','10646','1054','20984','4917','2846','155','114202','40','167','1058','600','2699','333','2413','808','8143','4037','1278','4322','2543','288','932','24264','1033','28760','7572','16970','4911','23002','21346','5811','698','1794','2877','6975','567','952','135','140','740','465','1024','2188','114','1497','1649','226','246','7753','190','13204','15013','360','3068','12960','43281','5689','14317','5499','1905','6845','11447','2473','2149','1852','1383','1200','1613','768','2844','410','109','10215','2461','6126','749','611','351','381','188','2918','563','611','1087','8730','3506','123','8141','347','2275','5961','792','295','4956','196','949','597','570','13423','316','7747','1060','251','4160','2146','1663','210','961','21895','239','2146','839','579','11903','203','4856','30063','985','1057','3189','1044','358','35','1320','8262','3292','4488','15887','5304','453','2225','66','3859','9471','97','426','6011','43','0','2227','1337','13278','2130','333','25343','7446','290','6076','273','716','31507','43089','254','12530','966','3708','25269','995','546','299','11168','4719','2650','4103','666','3084','358','507','3505','727','96','4559','3014','1647','468','23936','7751','139','715','998','1240','449','4872','1208','20618','17314','555','442','815','1897','1075','11123','123','2462','3705','1150','24653','4977','17969','17638','2137','97','18758','2470','3326','1225','3232','2974','147','359','2496','4540','464','493','30985','1700','7350','8714','25400','8038','8884','5150','196','7943','3778','10','38','1146','390','2765','18306','2197','1506','240','213','116','4155','94','3137','3512','22436','28011','443','474','3503','19578','116','15435','37','2177','11487','17888','672','1179','1666','22032','1530','23','822','15544','116','30','11071','4750','778','3147','3387','4370','13864','34762','4845','265','11369','1993','2832','2803','8540','2094','3265','4707','325','449','994','11489','232','454','637','690','52','799','794','3363','360','3','193','626','3086','2023','24178','1309','19813','1235','22197','17588','3472','438','6334','3265','488','35889','29603','827','3302','10102','283','8836','142','1676','444','11448','9962','6676','334','17797','261','10572','8599','327','731','223','123','542','36','3338','8991','1245','3062','1574','1993','889','2221','3148','48','216','1889','1591','4458','10035','718','23406','15832','3100','78','43','1879','6374','1001','24468','3340','1871','10330','90','31084','1670','1256','15663','19611','6046','327','119','385','8207','158','1490','17','56','453','685','3098','1246','3121','2368','4361','4104','147','29666','32993','2014','8200','83','51','10840','1555','4241','1162','416','663','0','2664','939','7484','4573','1616','22423','3946','1298','11881','744','520','5549','4498','4186','905','2627','2196','20721','3684','731','431','188','3042','380','245','4008','36388','32706','4420','67012','18994','82815','24554','39804','36245','1426','3202','1321','314','478','886','4692','3916','4730','990','1733','2668','7824','1583','453','187','5120','518','24137','5140','1025','22369','9576','5592','213','116','1530','8015','16','2586','11220','1226','4982','6532','5755','10688','7782','3892','9547','7037','5172','5405','5459','1122','738','1900','1513','18059','821','10085','204','5071','605','94','729','1372','24395','29327','18208','17694','12783','32828','643','20656','4734','41','19933','16598','1373','1613','1538','5345','21682','1255','4009','10463','1408','553','8733','1451','5856','425','4648','10423','18717','3756','1851','2192','989','684','2318','423','10402','482','222','3443','1569','25128','7931','3428','124','432','2954','639','1398','1411','1998','3571','13719','105','626','3387','16686','53111','400','269','50257','59','2108','3276','5844','194','6497','22497','34888','11739','136','1904','3459','1155','34','7446','2249','383','1802','2842','933','692','69','2183','21915','3039','1469','19616','667','301','1247','135','3284','905','1388','1360','1108','5607','6075','716','2123','198','830','2661','419','656','2588','145','4838','2340','462','230','105','216','20501','104','504','6705','36216','478','4889','17396','1712','1002','1777','2175','70','25805','43967','30913','480','48','9077','88','1279','15292','1372','3110','7092'];

        $('.cxl-show-text').before($('.cxl-benefits-container').clone().addClass('cxl-benefits-container-new'));
        $('.cxl-benefits-container:eq(0)').hide();
        $('.cxl-benefits-container').css({'border-bottom':'none','padding': '10px 19px 6px 0px'});
        $('.directory-header').css('border-top', '1px solid #b2ccdb')
        var thisPath=window.location.pathname;
        thisPath=thisPath.replace('/sem/','');
        thisPath=thisPath.replace('-software','');
        var index=urls.indexOf(thisPath);
        var reviewCount=reviews[index];
        var reviewFormat=numberWithCommas(reviewCount);
        //var replaced1=$('.cxl-benefits-container:eq(1) div:nth-child(2) span').text().replace('825,000+', reviewCount);
        $('.cxl-benefits-container:eq(1) div:nth-child(2) span').html( '<span class="cxl-orange"> ' + reviewFormat + '</span> verified user reviews');

    }
})(jQuery);

(function($){

    //console.log('v=1.1.1');

    var wait = setTimeout(function(){
        if ( $('.cxl-benefits-container-new').length > -1 ) {
            run_all();
        }else{
            wait();
        }

    }, 250);

    function numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    function run_all() {


        //newStuff

        var urls=['360-degree-feedback','3d-architecture','3d-cad','ab-testing','aml','api-management','account-based-marketing','accounting','accounting-practice-management','accounts-payable','accounts-receivable','accreditation-management','ad-server','admissions','advertising-agency','advocacy','affiliate','agile-project-management-tools','airline-reservation-system','alumni-management','android-kiosk','animal-shelter','anti-spam','app-design','apparel-management','applicant-tracking','application-development','application-lifecycle-management','application-performance-management','appointment-reminder','appointment-scheduling','arborist','architectural-cad','architecture','archiving','art-gallery','artificial-intelligence','assessment','asset-tracking','assisted-living','association-management','attendance-tracking','auction','audience-response','audit','augmented-reality','authentication','auto-body','auto-dealer','auto-dealer-accounting','auto-dialer','auto-repair','automated-testing','aviation-maintenance','bim','background-check','backup','bakery','banking-systems','bankruptcy','bar-pos','barbershop','barcoding','benefits-administration','big-data','billing-and-invoicing','billing-and-provisioning','blockchain-platform','blog','board-management','bookkeeper','brand-management','brand-protection','brewery','budgeting','bug-tracking','building-maintenance','business-card','business-continuity','business-intelligence','business-management','business-performance-management','business-phone-systems','business-plan','business-process-management','cmdb','cmms','cpq','calibration-management','call-accounting','call-center','call-recording','call-tracking','camp-management','campaign-management','campground-management','car-rental','carpet-cleaning','catalog-management','catering','cemetery','change-management','channel-management','chemical','child-care','chiropractic','church-accounting','church-management','church-presentation','claims-processing','class-registration','classroom-management','click-fraud','clinical-trial-management','cloud-communication-platform','cloud-management','cloud-pbx','cloud-security','cloud-storage','club-management','coaching','code-enforcement','collaboration','commercial-insurance','commercial-loan','commercial-real-estate','commission','community','company-secretarial','compensation-management','competitive-intelligence','complaint-management','compliance','computer-repair-shop','computer-security','conference','conflict-checking','consignment','construction-accounting','construction-bid-management','construction-crm','construction-estimating','construction-management','construction-scheduling','contact-management','content-management','content-marketing','contest','continuous-integration','contract-management','contractor-management','convenience-store','conversational-ai-platform','conversational-marketing-platform','corporate-tax','corporate-wellness','corrective-and-preventive-action','courier','course-authoring','court-management','creative-management','credentialing','currency-exchange','customer-advocacy','customer-communications-management','customer-data-platform','customer-engagement','customer-experience','customer-journey-mapping-tools','customer-loyalty','customer-reference-management','customer-relationship-management','customer-satisfaction','customer-service','customer-success','cybersecurity','dance-studio','dashboard','data-analysis','data-center-management','data-discovery','data-entry','data-extraction','data-governance','data-loss-prevention','data-management','data-mining','data-quality','data-visualization','data-warehouse','database-management','debt-collection','decision-support','deep-learning','delivery-management','demand-planning','dental','dental-charting','dental-imaging','dermatology','devops','diagram','digital-adoption-platform','digital-asset-management','digital-rights-management','digital-signage','digital-signature','digital-workplace','disk-imaging','distribution','dock-scheduling','docketing','document-control','document-generation','document-management','document-version-control','donation-management','driving-school','dry-cleaning','eam','edi','ehs-management','ems','etl','electrical-contractor','electrical-design','electrical-estimating','electronic-data-capture','electronic-discovery','electronic-medical-records','email-archiving','email-management','email-marketing','email-security','email-signature','email-tracking','email-verification-tools','emergency-notification','emissions-management','employee-communication-tools','employee-engagement','employee-monitoring','employee-recognition','employee-scheduling','endpoint-protection','energy-management','engineering-cad','enterprise-architecture','enterprise-content-management','enterprise-resource-planning','enterprise-search','environmental','equipment-maintenance','equity-management','ergonomics','event-booking','event-check-in','event-management','event-marketing','exam','expense-report','facility-management','farm-management','fashion-design-and-production','fax-server','festival-management','field-service-management','file-sharing','file-sync','financial-crm','financial-fraud-detection','financial-management','financial-reporting','financial-risk-management','financial-services','fire-department','fitness','fixed-asset-management','fleet-maintenance','fleet-management','florist','flowchart','food-delivery','food-service-distribution','food-service-management','food-traceability','forestry','forms-automation','franchise-management','freight','fuel-management','fund-accounting','fundraising','funeral-home','gdpr-compliance','gis','gps-tracking','grc','game-development','gamification','gantt-chart','garage-door','garden-center','golf-course','government','gradebook','grant-management','graphic-design','guest-management','gymnastics','hoa','hr-analytics','hvac','hvac-estimating','handyman','healthcare-crm','heatmap','hedge-fund','help-desk','higher-education','home-builder','home-care','home-health-care','home-inspection','horse','hospice','hospital-management','hospitality-property-management','hostel-management','hotel-channel-management','human-resource','human-services','it-asset-management','it-management','it-project-management','it-service','itsm','ivr','iwms','idea-management','identity-management','image-analysis','image-recognition','incident-management','influencer-marketing','innovation','inside-sales','inspection','insurance-agency','insurance-policy','insurance-rating','integrated-risk-management','integration','intellectual-property-management','internal-communications','intranet','inventory-control','inventory-management','investigation-management','investment-management','iot','issue-tracking','jail-management','janitorial','java-cms','jewelry-store-management','job-board','job-costing','job-evaluation','job-shop','k-12','kanban-tools','kennel','key-management','kiosk','knowledge-management','laboratory-information-management-system','land-management','landing-page','landscape','law-enforcement','law-practice-management','lawn-care','lead-capture','lead-generation','lead-management','lead-nurturing','learning-analytics','learning-management-system','lease-accounting','lease-management','leave-management-system','legal-billing','legal-calendar','legal-case-management','legal-document-management','library-automation','license-management','link-management-tools','live-chat','load-balancing','loan-origination','loan-servicing','location-intelligence','locksmith','log-management','logbook','logistics','long-term-care','lost-and-found','mlm','mrm','mrp','msp','mac-crm','machine-learning','maid-service','mailroom-management','maintenance-management','manufacturing','manufacturing-execution','marine','market-research','marketing-analytics','marketing-attribution','marketing-automation','marketing-planning','marketplace','martial-arts','massage-therapy','master-data-management','medical-billing','medical-imaging','medical-inventory','medical-lab','medical-practice-management','medical-scheduling','medical-spa','medical-transcription','meeting','meeting-room-booking-system','membership-management','mental-health','mentoring','microlearning','mind-mapping','mining','mobile-analytics','mobile-banking','mobile-content-management-system','mobile-credit-card-processing','mobile-device-management','mobile-learning','mobile-marketing','mobility','mortgage-and-loans','moving','multi-channel-ecommerce','municipal','museum','music-school','network-mapping','network-monitoring','network-security','network-troubleshooting','nonprofit','nonprofit-accounting','nonprofit-crm','nursing-home','nutrition-analysis','nutritionist','ocr','oee','okr','occupational-therapy','oil-and-gas','onboarding','online-banking','online-crm','online-proofing','optometry','order-entry','order-management','org-chart','p&c-insurance','pacs','pci-compliance','pdf','pim','ppc','packaging','parcel-audit','parking-management','parks-and-recreation','password-management','patch-management','patient-case-management','patient-engagement','patient-management','patient-portal','pawn-shop','payment-processing','payroll','pediatric','performance-appraisal','performance-testing','permit','personal-trainer','personalization','pest-control','pet-grooming','pet-sitting','pharmacy','photo-booth','photography-studio','physical-security','physical-therapy','pilates-studio','plastic-surgery','plumbing','plumbing-estimating','podiatry','point-of-sale','policy-management','political-campaign','polling','pool-service','portal','pre-employment-testing','predictive-analytics','predictive-dialer','presentation','preventive-maintenance','pricing-optimization','print-estimating','privileged-access-management','procurement','product-configurator','product-data-management','product-lifecycle-management','product-management','product-roadmap','production-scheduling','productivity','professional-services-automation','project-management','project-planning','project-portfolio-management','project-tracking','proofreading','proposal-management','prototyping','public-relations','public-transportation','public-works','publishing-and-subscriptions','punch-list','purchasing','push-notifications','qualitative-data-analysis','quality-management','quoting','rdbms','rfp','radiology','real-estate-agency','real-estate-cma','real-estate-crm','real-estate-property-management','real-estate-transaction-management','recruiting','recruiting-agency','recurring-billing','recycling','reference-check','referral','registration','relocation','remodeling-estimating','remote-support','rental','rental-property-management','reporting','reputation-management','requirements-management','reservations','residential-construction-estimating','resource-management','restaurant-management','restaurant-pos','retail-management-systems','retail-pos-system','retargeting','revenue-management','review-management','risk-management','roofing','route-planning','seo','siem','sms-marketing','spc','saas-management','safety-management','sales-coaching','sales-enablement','sales-force-automation','sales-forecasting','sales-tax','salon','scheduling','scholarship-management','school-accounting','school-administration','school-bus-routing','scrum','security-system-installer','self-storage','server-backup','server-management','service-desk','service-dispatch','shipment-tracking','shipping','shopping-cart','simulation','single-sign-on','small-business-crm','small-business-loyalty-programs','small-business-ecommerce','social-crm-tools','social-media-analytics-tools','social-media-management','social-media-marketing','social-media-monitoring','social-networking','social-selling','social-work-case-management','softphone','source-code-management','sourcing','spa','space-management','speech-recognition','speech-therapy','sports-league','spreadsheet','staffing-agency','statistical-analysis','stock-portfolio-management','store-locator','strategic-planning','student-engagement-platform','student-information-system','subscription-management','succession-planning','supply-chain-management','survey','sustainability','swim-school','takeoff','talent-management','task-management','tattoo-studio','tax-practice-management','team-communication','telecom-expense-management','telemarketing','telemedicine','telephony','text-mining','ticketing','time-clock','time-tracking','time-and-expense','timeshare','tool-management','tour-operator','towing','trade-promotion-management','training','transactional-email','translation-management','transportation-dispatch','transportation-management','travel-agency','travel-management','treasury','trucking','trust-accounting','tutoring','ux','unified-communications','utility-billing','utility-management-systems','vpn','vr','vacation-rental','vector-graphics','vendor-management','venue-management','veterinary','video-editing','video-interviewing','video-making','video-management','video-marketing','virtual-data-room','virtual-machine','virtual-tour','virtualization','visitor-management','visual-search','voip','volunteer-management','voting','vulnerability-management','waitlist','waiver','warehouse-management','warranty-management','waste-management','web-analytics','web-conferencing','web-to-print','webinar','website-builder','website-monitoring','website-optimization-tools','winery','wireframe','wireless-expense-management','work-order','workflow-management','workforce-management','worship','yard-management','yoga-studio','zoo','eprescribing','ecommerce','elearning-authoring-tools','ipad-kiosk','ipad-pos'];

        var prods=['169','25','43','44','40','46','45','464','34','149','120','18','44','71','125','43','73','37','23','56','17','17','37','54','113','378','459','73','151','54','267','18','32','108','45','38','224','70','142','78','149','288','89','31','186','44','34','39','203','16','43','137','165','125','43','30','94','51','190','12','56','28','96','117','157','459','114','2','30','69','63','130','17','29','137','102','101','26','196','449','368','199','60','29','354','17','233','58','52','58','369','134','81','42','226','34','82','25','103','64','17','42','145','53','165','96','36','201','20','128','27','133','26','129','44','185','42','75','56','217','37','41','655','17','55','42','46','112','27','100','41','67','530','30','160','78','9','20','91','38','76','192','480','27','168','442','194','48','38','213','113','33','97','18','22','41','34','77','145','54','19','28','50','19','82','55','269','344','26','263','13','742','173','293','88','194','72','131','123','72','38','76','134','71','37','143','29','34','233','27','194','170','75','31','56','31','164','16','19','14','61','37','15','285','24','247','119','33','17','169','16','23','39','43','640','23','168','16','43','56','100','287','59','43','60','23','22','122','91','382','40','205','472','57','18','36','50','45','34','48','373','54','124','201','83','197','103','34','63','644','46','106','137','14','12','54','65','460','39','65','174','281','173','71','27','27','568','170','33','81','83','42','183','152','48','73','115','197','86','454','37','21','68','76','97','80','39','230','49','192','53','60','238','39','102','124','103','59','28','77','30','23','39','33','136','58','74','49','14','23','66','46','159','31','25','50','33','93','330','125','42','67','128','41','49','33','256','438','20','20','738','56','198','244','73','113','142','122','20','162','181','15','15','66','52','67','115','199','163','105','55','28','257','33','88','73','191','405','48','213','104','160','40','30','13','85','100','99','20','30','120','27','40','14','74','250','41','18','66','81','165','170','26','94','190','328','31','24','628','31','103','46','100','43','191','160','71','99','32','306','36','144','147','45','9','57','22','275','77','18','62','24','146','50','23','59','74','39','249','152','172','81','106','128','46','544','66','43','63','39','33','193','26','44','151','393','155','56','43','195','31','243','171','45','40','17','41','48','25','21','24','82','100','51','103','127','53','93','20','34','26','27','255','315','24','162','22','27','16','18','21','25','27','49','43','227','171','42','128','19','56','70','243','25','30','25','37','67','63','60','20','17','71','40','59','30','57','55','99','37','18','329','294','24','214','33','14','90','98','58','35','21','78','15','38','92','88','25','16','104','24','12','479','55','64','34','21','143','101','113','96','115','57','110','66','44','234','113','63','126','62','50','114','148','160','816','42','140','54','19','124','25','58','57','53','112','32','123','77','32','281','146','14','20','39','159','20','111','288','35','528','68','78','22','18','96','221','17','21','84','120','122','236','222','69','336','28','92','293','242','286','43','26','52','95','312','32','81','165','32','206','42','22','96','41','313','261','73','25','175','345','21','61','531','18','18','29','30','43','105','54','180','20','267','62','94','33','32','26','45','9','24','131','334','68','122','18','22','19','26','54','106','42','64','47','106','22','30','101','30','40','66','41','62','25','32','334','350','31','20','49','267','259','18','27','105','89','27','49','222','31','271','254','421','169','12','40','226','31','23','463','26','62','229','163','179','64','33','185','50','34','54','63','146','33','37','27','152','15','146','52','88','48','82','35','165','22','63','26','41','68','182','18','122','95','25','66','14','14','326','14','82','220','137','63','48','198','139','39','77','33','37','179','364','409','21','24','72','13','15','527','56','22','67'];

        var thisPath=window.location.pathname;
        thisPath=thisPath.replace('/sem/','');
        thisPath=thisPath.replace('-software','');
        var index=urls.indexOf(thisPath);
        var productNumber=prods[index];
        var productFormat=numberWithCommas(productNumber);
        //var replaced2=$('.cxl-benefits-container:eq(1) div:first-child span').text().replace('700+',productNumber);
        $('.cxl-benefits-container:eq(1) div:first-child span').html('<span class="cxl-orange">' + productFormat + '</span> products');

    }

})(jQuery);

function customPageCode_Var1() {

    var wait = setTimeout(function(){
        if ( $('.cxl-benefits-container-new').length > -1 ) {
            run_all();
        }else{
            wait();
        }

    }, 250);

    function run_all() {

        //CTAs in Sec header
        var currentUrl = location.pathname.replace('/sem', '');
        $('.cxl-benefits-container.cxl-benefits-container-new').after('\
        <div class="customSecHeader-CTA-group">\
            <a id="buyers-guide-sem-test" href="' + currentUrl + '#buyers-guide" target="_blank">Read Buying Guide</a>\
        </div>');
    }
}

$(document).ready(function() {
    customPageCode_Var1();
});
