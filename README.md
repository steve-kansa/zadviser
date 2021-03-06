---
home: true
metaTitle: zAdviser
#heroImage: ./images/zadviserLogo.png
heroText: Compuware zAdviser
tagline: zAdviser is your toolkit for deploying and operating serverless Mainframe analytics architecture. Focus on the KPIs that count.
actionText: Get Started →
actionLink: /guide/
features:
- title: Simplicity First
  details: Minimal setup with markdown-centered project structure helps you focus on writing.
- title: Cloud-Powered
  details: Enjoy the dev experience of Vue + webpack, use Vue components in markdown, and develop custom themes with Vue.
- title: Performant
  details: VuePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
footer: MIT Licensed | Copyright © 2018-present David Kennedy
---

# Getting Started with zAdviser on z/OS

## Steps for zAdviser Enablement

The following steps will require current ECC maintenance.  This support requires ECC current maintenance and z/OS 2.3, or current maintenance for the IBM Web Enablement Toolkit. 

The PTF required for Base zAdviser support is CXS592A.  This includes the enablement of Compuware data collection for all products, within Enterprise Common Components (ECC).

## License Management

Compuware highly recommends updating the ECC parameters, including LMCLxx to PARMLIB II.  For ANY enhanced zAdviser support ECC must be upgraded to PARMLIB II.  The migration process is documented in the ECC Installation and Customization Guide under 'Milestone 10: Migration Utility'.
1. Update LMS PARMLIB

The following parameters must be specified in the LMCLxx PARMLIB member. 

**PARMLIB Version 2**

```bash
SMF_ID=241                1-3 DIGIT SMF RECORD ID (RANGE: 128-255)
SMF_LOGALL=YES            ENABLE COLLECTION OF ALL CPWR PRODUCTS
```

**PARMLIB Version 1**

```bash
SMF_ID=(241,LOGALL)       1-3 DIGIT SMF RECORD ID
```

2. Remove the `ROI_CAPTURE` parameter.  This parameter is obsolete with current maintenance.

## Streaming 

1. Create RACF Keyring
  
    - The RACF command RACDCERT is documented within the [z/OS IBM documentation](https://www.ibm.com/support/knowledgecenter/en/SSLTBW_2.3.0/com.ibm.zos.v2r3.icha400/le-addring.htm) .  This allows for SSL communications between z/OS and Compuware.

   - Add all four trusted Amazon Root CAs from [AWS Trust Store](https://www.amazontrust.com/repository/) to the keyring created.
    
   - This value will be specified on the `CES_SSL_KEYRING` parameter in the CMSCxx PARMLIB member

2. Grant the CMSC Certificate Access

   - The CMSC started task USERID needs to be granted UPDATE access to the FACILITY class `IRR.DIGTCERT.LISTRING`.  UPDATE-level access allows the CMSC to access and use the RACF keyring previously created.

3. Update CMSC PARMLIB

   - Add the following parameters to the CMSCxx PARMLIB member.  Note that the keyring parameter value is case sensitive.

```RACF Keyring
CES_SSL_KEYRING=YOURKR/awscerts
```    

4. Update Global PARMLIB Member

   - Add the following parameters to the CWGLxx (Compuware Global) PARMLIB member.  

```bash
ZADVISER=YES
ZADVISER_QUEUE_ENTRIES=20       
ZADVISER_SMF_VERSION=17.02.00
ZADVISER_SMF_BUFF_INT=60
```

5. Cycle the CMSC

   - `MSCSC44*` messages will be issued to //FDBDLOG upon successful configuration.

### Expected Outputs

The CMSC DD //FDBDLOG contains various messages issues by the CMSC zAdviser support.  The output of this DD is required for diagnosing any issues with zAdviser streaming support.

Expected output on startup.  

 ```bash
10AUG2018 10:47:52.18 MPLU FDBRC1101I SUBTASK 11 MSCJCAIM BEING ATTACHED                                                    
10AUG2018 10:47:52.19 CAIM FDBRC1001I SUBTASK 11 MSCJCAIM INITIALIZATION COMPLETED                                          
10AUG2018 10:47:52.19 MPLU FDBRC1102I SUBTASK 11 MSCJCAIM SUCCESSFULLY ATTACHED                                             
10AUG2018 10:47:52.19 CAIM MSCSC4405I ZADVISER SERVICE INITIALIZATION STARTED.                                              
10AUG2018 10:47:52.19 CAIM MSCSC4413I ZADVISER WORK BUFFER INITIALIZED AT 00000050_00000000.                                
10AUG2018 10:47:52.19 CAIM MSCSC4413I ZADVISER WORK BUFFER INITIALIZED AT 00000050_00100000.                                
10AUG2018 10:47:52.19 CAIM MSCSC4413I ZADVISER WORK BUFFER INITIALIZED AT 00000050_00200000.                                
10AUG2018 10:47:52.19 CAIM MSCSC4413I ZADVISER WORK BUFFER INITIALIZED AT 00000050_00300000.                                
10AUG2018 10:47:52.70 CAIM MSCSC4413I ZADVISER WORK BUFFER INITIALIZED AT 00000050_00400000.                                
10AUG2018 10:47:52.70 CAIM MSCSC4413I ZADVISER WORK BUFFER INITIALIZED AT 00000050_00500000.                                
10AUG2018 10:47:52.71 CAIM MSCSC4408I ZADVISER DESTINATION=HTTPS://DNS.API.COMPUWARE.COM:443/STATUS, 00000000_00000000      
10AUG2018 10:47:52.71 CAIM MSCSC4408I ZADVISER DESTINATION=HTTPS://ZADVISER.API.COMPUWARE.COM:443/INBOUND, 00000050_00600000
10AUG2018 10:47:52.71 SP07 MSCSC4416I ZADVISER SUPPORT IS CONFIGURED AND ACTIVE.
```    
Expected output on successful send
 ```bash
10AUG2018 12:18:17.32 CAIM MSCSC4214I PROCESSING REQUEST QUEUE.  ELEMENT=3DBA8998.                                         
10AUG2018 12:18:17.32 CAIM MSCSC4409I PROCESSING REQUEST QUEUE.  ELEMENT=3DBA8998. ANCHOR=00000050_00000000.               
10AUG2018 12:18:17.32 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00000000.                                 
10AUG2018 12:18:17.32 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00008030.                                 
10AUG2018 12:18:17.32 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00010060.                                 
10AUG2018 12:18:17.32 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00018090.                                 
10AUG2018 12:18:17.32 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_000200C0.                                 
10AUG2018 12:18:17.32 CAIM MSCSC4411I ALL ENTRIES ADDED BACK TO QUEUE.                                                     
10AUG2018 12:18:17.33 CAIM MSCSC4412I CMSC SEND BUFFER HAS BEEN RESET. ANCHOR=00000050_00600000, CURRENT=00000050_00600030.
10AUG2018 12:18:17.33 CAIM MSCSC4418I ZADVISER TASK MSCJRSTX 009C5080 ATTACHED. ELEMENT=3DBA8998.                          
10AUG2018 12:18:18.61 CAIM MSCSC4201I REST PROCESSING TASK MSCJRSTX 009C5080 ENDED
```    
Expected output on unsuccessful send
 ```bash
16AUG2018 10:46:14.02 FOWN FDBFO0000I POSTED BY FDBMSPLU, TASK 0008, REQUEST CODE X'09'                                    
16AUG2018 10:46:14.02 FOWN FDBFO0001I TASK 0008, REQUEST CODE X'09', COMPLETED WITH RC (00000000)                          
16AUG2018 10:48:16.73 CAIM MSCSC4214I PROCESSING REQUEST QUEUE.  ELEMENT=372F8068.                                         
16AUG2018 10:48:16.73 CAIM MSCSC4409I PROCESSING REQUEST QUEUE.  ELEMENT=372F8068. ANCHOR=00000050_00100000.               
16AUG2018 10:48:16.73 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00100000.                                 
16AUG2018 10:48:16.73 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00108030.                                 
16AUG2018 10:48:16.74 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00110060.                                 
16AUG2018 10:48:16.74 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_00118090.                                 
16AUG2018 10:48:16.74 CAIM MSCSC4410I ENTRY ADDED BACK TO QUEUE.  ENTRY=00000050_001200C0.                                 
16AUG2018 10:48:16.77 CAIM MSCSC4411I ALL ENTRIES ADDED BACK TO QUEUE.                                                     
16AUG2018 10:48:16.77 CAIM MSCSC4412I CMSC SEND BUFFER HAS BEEN RESET. ANCHOR=00000050_00600000, CURRENT=00000050_00600030.
16AUG2018 10:48:16.77 CAIM MSCSC4418I ZADVISER TASK MSCJRSTX 008AE450 ATTACHED. ELEMENT=372F8068.                          
16AUG2018 10:49:18.17 RSTX MSCSC4414I CPWR API DEBUG RSTX FAILURE, RC= nnnnnnnn DIAG= DIAGNOSTIC_MESSAGE_TEXT      
16AUG2018 10:49:18.18 CAIM MSCSC4201I REST PROCESSING TASK MSCJRSTX 008AE450 ENDED                                         
16AUG2018 10:49:18.18 CAIM MSCSC4428I ZADVISER "POST" REQUEST STATUS=500, DATA=37D13858 LEN=373488A8                       
```    


## zAdviser Console Commands

**Display environment information**

`MODIFY cmscname,ZADviser DISPLAY`

```bash
21AUG2018 10:18:30.68 MPLU FDBRC1129I OPERATOR COMMAND ZADVISER SCHEDULED FOR PROCESSING              
21AUG2018 10:18:30.68 SP07 FDBRC0701I DISPATCHED FOR TRAN# 24, TRANID ZDCM, USERID SYSTEM(255)   
21AUG2018 10:18:30.70 SP07 MSCSC4423I ZADVISER INFORMATION DISPLAY                               
21AUG2018 10:18:30.70 SP07 MSCSC4424I  TIME OF MOST RECENT SEND: 21AUG2018 08:14:06.02038        
21AUG2018 10:18:30.70 SP07 MSCSC4425I  CURRENT WORK BUFFER   : 00000000_3717E018                 
21AUG2018 10:18:30.70 SP07 MSCSC4425I  GLOBAL WORK QUEUE ENTS: 00000000_0000000F                 
21AUG2018 10:18:30.70 SP07 MSCSC4425I  FORMATTED AREA ORIGIN : 00000050_00600000                 
21AUG2018 10:18:30.70 SP07 MSCSC4425I  WORK BUFFER DIRECTORY 00000050_000200C0                   
21AUG2018 10:18:30.70 SP07 MSCSC4424I   LAST MODIFICATION AT 21AUG2018 08:14:03.27749            
21AUG2018 10:18:30.70 SP07 MSCSC4425I   MAXIMUM ENTRIES 00000000_0000000F                        
21AUG2018 10:18:30.70 SP07 MSCSC4425I   MAXIMUM SIZE 00000000_00008000                           
21AUG2018 10:18:30.70 SP07 MSCSC4425I  WORK BUFFER DIRECTORY 00000050_00100000                   
21AUG2018 10:18:30.70 SP07 MSCSC4424I   LAST MODIFICATION AT 21AUG2018 08:14:03.23498            
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM ENTRIES 00000000_0000000F                        
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM SIZE 00000000_00008000                           
21AUG2018 10:18:30.71 SP07 MSCSC4425I  WORK BUFFER DIRECTORY 00000050_00200000                   
21AUG2018 10:18:30.71 SP07 MSCSC4424I   LAST MODIFICATION AT 21AUG2018 08:13:30.38531            
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM ENTRIES 00000000_0000000F                        
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM SIZE 00000000_00008000                           
21AUG2018 10:18:30.71 SP07 MSCSC4425I  WORK BUFFER DIRECTORY 00000050_00300000                   
21AUG2018 10:18:30.71 SP07 MSCSC4424I   LAST MODIFICATION AT 10AUG2018 10:48:36.57360            
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM ENTRIES 00000000_0000000F                        
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM SIZE 00000000_00008000                           
21AUG2018 10:18:30.71 SP07 MSCSC4425I  WORK BUFFER DIRECTORY 00000050_00400000                   
21AUG2018 10:18:30.71 SP07 MSCSC4424I   LAST MODIFICATION AT 10AUG2018 10:48:37.08123            
21AUG2018 10:18:30.71 SP07 MSCSC4425I   MAXIMUM ENTRIES 00000000_0000000F                        
21AUG2018 10:18:30.72 SP07 MSCSC4425I   MAXIMUM SIZE 00000000_00008000                           
21AUG2018 10:18:30.72 SP07 MSCSC4425I  WORK BUFFER DIRECTORY 00000050_00500000                   
21AUG2018 10:18:30.72 SP07 MSCSC4424I   LAST MODIFICATION AT 10AUG2018 10:48:37.08569            
21AUG2018 10:18:30.72 SP07 MSCSC4425I   MAXIMUM ENTRIES 00000000_0000000F                        
21AUG2018 10:18:30.72 SP07 MSCSC4425I   MAXIMUM SIZE 00000000_00008000                           
21AUG2018 10:18:30.72 FOWN FDBFO0000I POSTED BY FDBMSPLU, TASK 0007, REQUEST CODE X'09'          
21AUG2018 10:18:30.72 FOWN FDBFO0001I TASK 0007, REQUEST CODE X'09', COMPLETED WITH RC (00000000)
```

**Stopping the zAdviser service**

`MODIFY cmscname,ZADviser SHUT`

```bash
21AUG2018 10:30:43.01 SCHD FDBRC1312I TRANSACTION SCHEDULED NUMBER 4, TRANID ZDCM, FOR USERID SYSTEM  
21AUG2018 10:30:43.01 SP07 FDBRC0701I DISPATCHED FOR TRAN# 4, TRANID ZDCM, USERID SYSTEM(255)         
21AUG2018 10:30:43.01 MPLU FDBRC1129I OPERATOR COMMAND ZADVISER SCHEDULED FOR PROCESSING              
21AUG2018 10:30:43.04 CAIM FDBRC1002I SUBTASK 11 MSCJCAIM POSTED FOR TERMINATION                      
21AUG2018 10:30:43.05 FOWN FDBFO0000I POSTED BY FDBMSPLU, TASK 0007, REQUEST CODE X'09'               
21AUG2018 10:30:43.05 FOWN FDBFO0001I TASK 0007, REQUEST CODE X'09', COMPLETED WITH RC (00000000)     
21AUG2018 10:30:43.06 MPLU FDBRC1104I SUBTASK 11 MSCJCAIM ENDED (AS EXPECTED). COMPLETION CODE=0
```

**Enable HTTP logging to DD**

`MODIFY cmscname,ZADviser DBUG=YES`

```bash
21AUG2018 10:19:31.53 SCHD FDBRC1312I TRANSACTION SCHEDULED NUMBER 25, TRANID ZDCM, FOR USERID SYSTEM
21AUG2018 10:19:31.53 MPLU FDBRC1129I OPERATOR COMMAND ZADVISER SCHEDULED FOR PROCESSING             
21AUG2018 10:19:31.53 SP07 FDBRC0701I DISPATCHED FOR TRAN# 25, TRANID ZDCM, USERID SYSTEM(255)       
21AUG2018 10:19:31.54 FOWN FDBFO0000I POSTED BY FDBMSPLU, TASK 0007, REQUEST CODE X'09'              
21AUG2018 10:19:31.54 FOWN FDBFO0001I TASK 0007, REQUEST CODE X'09', COMPLETED WITH RC (00000000)    
```

**Disable HTTP logging to DD**

`MODIFY cmscname,ZADviser DBUG=NO`

```bash
21AUG2018 10:20:27.13 SCHD FDBRC1312I TRANSACTION SCHEDULED NUMBER 26, TRANID ZDCM, FOR USERID SYSTEM 
21AUG2018 10:20:27.13 MPLU FDBRC1129I OPERATOR COMMAND ZADVISER SCHEDULED FOR PROCESSING              
21AUG2018 10:20:27.13 SP07 FDBRC0701I DISPATCHED FOR TRAN# 26, TRANID ZDCM, USERID SYSTEM(255)        
21AUG2018 10:20:27.14 FOWN FDBFO0000I POSTED BY FDBMSPLU, TASK 0007, REQUEST CODE X'09'               
21AUG2018 10:20:27.14 FOWN FDBFO0001I TASK 0007, REQUEST CODE X'09', COMPLETED WITH RC (00000000)     
```
 
## zAdviser Global Parameters 

**ZADVISER=NO|yes**

Description: The zAdviser parameter is used to specify whether the CMSC will send data to zAdviser.

Default: No

Required: No

**ZADVISER_QUEUE_ENTRIES=nnn**

Description: A decimal number from 5-250 that specifies the maximum number of buffers that are used prior to sending zAdviser data.  This specification determines the frequency in which records are sent to zAdviser.  Compuware recommends using the default value of 20.

Default: 20

Required: No

**ZADVISER_SMF_VERSION=vv.rr.mm**

Description: A version number that identifies a Compuware-global setting for the version of SMF records that ALL Compuware products will write.  For current zAdviser support this parameter must be set to 17.02.07 once all Compuware products are current on maintenance.  This value must otherwise be set to 17.02.00.

Default: 17.02.07


Required: No

**ZADVISER_SMF_BUFF_INT=nnnn**

Description: A decimal number from 1-1440 that specifies the interval, in minutes, of the maximum time a Compuware product will wait before sending records to the zAdviser service.  This is only used by products that frequently record usage data.

Default: None

Required: No