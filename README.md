# Quizzer
# Java Quiz Application

### West Virginia Univeristy - CS - Software Portablility - Programming Assignment #3

##### Quizzer - Description

Quizzer is a Java application which will take a file with questions and run a quiz based on those questions.

# quizzer-server
quizzer application user and quiz log

# End Points
1) Lookup a user account: https://quizzer-270214.appspot.com/qq/userLookup/:user
    Method: GET
2) Make a user account an 'ADMIN': https://quizzer-270214.appspot.com/qq/makeAdmin/:user
    Method: GET
3) Delete a user account: https://quizzer-270214.appspot.com/qq/deleteUser/:user
    Method: GET
4) Add a user's quiz result: https://quizzer-270214.appspot.com/qq/addQuizHistory/
    Method: POST
    fields: `QQH_GUI`, `QQH_OS`, `QQH_ASKED`, `QQH_CORRECT`, `QQH_DURATION`, `QQH_START_TS`, `QQH_QUIZ_FILE`, `QQH_QU_ID`
    Submitted as application/x-www-form-urlencoded
5) Lookup a user's quiz result history: https://quizzer-270214.appspot.com/qq/QHlookup/:user
    Method: GET
6) Lookup all the quiz results: https://quizzer-270214.appspot.com/qq/QHlookupAll/:user
    Method: GET