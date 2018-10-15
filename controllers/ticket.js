
var db_query = require('../db/executeQuery');
var ticket_query = require('../db/ticketQuery');
var moment = require('moment');

function generateTicketByDoctorIdAndCurrentDate(doctorId, next) {
    const query = ticket_query.queryGetServiceNoByDoctorId();
    const params = [doctorId];
    db_query.paramQuery(query, params, (err, serviceMap) => {
        if (err) return next(err);
        if(serviceMap.length>0){
            let serviceNo = serviceMap[0].ServiceID;
            const query = ticket_query.queryGenerateTicket();
            let currentDate =moment().format();
            const params = [serviceNo,currentDate];
             db_query.paramQuery(query, params, (err, result) => {
                if (err) return next(err);
                generateTicket(result[0], serviceNo, (err, newTicketNo) => {
                    saveTicketDetail(newTicketNo, serviceNo, (err, result) => {
                        return next(null, newTicketNo);
                    })
                })
            })
        } else {
            return next(null, "Service not exist corresponding to that doctor");
        } 
    })
}

function generateTicket(lastTicket, serviceNo, next) {
    if (!lastTicket && serviceNo) {
        generateFirstTicket(serviceNo, (err, firstTicket) => {
            next(null, firstTicket);
        })
    } else {
        let digits = lastTicket.TicketNo.substring(lastTicket.ServiceType.length, lastTicket.DigitLength + 1);
        digits = digits.split('');
        let increasedDigits = '';
        let updateDigitsArr = updateDigits(digits);
        for (let updateDigit of updateDigitsArr) {
            increasedDigits += updateDigit;
        }
        next(null, lastTicket.ServiceType + increasedDigits);
    }
}

function saveTicketDetail(newTicket, serviceNo, next) {

    const query = ticket_query.querysaveTicketDetail();
    let currentDate = new Date();
    const params = [newTicket, serviceNo, currentDate, currentDate, 0, 0, 0, 0, 1, 0, 0, 0, 0];
    db_query.paramQuery(query, params, (err, result) => {
        if (err) return next(err);
        next(null, result);
    })
}

function updateDigits(digitArr) {
    let count = 0;
    for (let i = digitArr.length - 1; i >= 0; i--) {
        if (digitArr[i] == 9 && count == 0) {
            digitArr[i] = 0;
        } else {
            if (count == 0) {
                digitArr[i] = parseInt(digitArr[i]) + 1;
                count++;
            }
        }
    }
    return digitArr;
}

function generateFirstTicket(serviceNo, next) {
    const query = ticket_query.queryGenerateFirstTicket();
    const params = [serviceNo];
    db_query.paramQuery(query, params, (err, result) => {
        let firstTicket = '';
        let digits = '';
        if (result[0].DigitLength === 3) {
            digits = '001';
            firstTicket = result[0].ServiceType + digits;
        } else if (result[0].DigitLength === 4) {
            digits = '0001';
            firstTicket = result[0].ServiceType + digits;
        }
        next(null, firstTicket);
    })
}

exports.generateTicketByDoctorIdAndCurrentDate = generateTicketByDoctorIdAndCurrentDate;