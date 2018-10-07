function queryGenerateTicket(){
    const columns = [
        'tkt.TicketNo','tkt.PrintTime','serv.DigitLength','serv.ServiceType'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM ticket tkt ' +
        'inner join service serv on serv.ServiceNo=tkt.ServiceNo ' +
        'where serv.ServiceNo=? order by tkt.PrintTime desc';
}
function queryGenerateFirstTicket(){
    const columns = [
        'serv.DigitLength','serv.ServiceType'
    ];
    return ' select distinct ' + columns.join(',') + ' FROM service serv ' +
    'where serv.ServiceNo=? ';
}

function querysaveTicketDetail(){
 var insertQuery='INSERT INTO TICKET(TicketNo,ServiceNo,PrintTime,QueueTime,ProcessingStatus,'+
   'Processing,Priority,Paused,DelayByTime,DelayWayValue,'+
    'DelayTicketsPassed,Reexam,SmsTimes)'+ 
    'values(?,?,?,?,?,?,?,?,?,?,?,?,?)';
    return insertQuery;
}

exports.queryGenerateTicket = queryGenerateTicket;
exports.querysaveTicketDetail = querysaveTicketDetail;
exports.queryGenerateFirstTicket = queryGenerateFirstTicket;
