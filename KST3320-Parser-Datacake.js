function Decoder(bytes, port) {

    // Output normalized Payload from the Gateway
    console.log(JSON.stringify(normalizedPayload,0,4));

    var gw_rssi = (!!normalizedPayload.gateways && !!normalizedPayload.gateways[0] && normalizedPayload.gateways[0].rssi) || 0;
    var gw_snr = (!!normalizedPayload.gateways && !!normalizedPayload.gateways[0] && normalizedPayload.gateways[0].snr) || 0;
    var gw_channel = (!!normalizedPayload.gateways && !!normalizedPayload.gateways[0] && normalizedPayload.gateways[0].channel) || 0;
    var gw_datarate = normalizedPayload.data_rate;
    var gw_freq = normalizedPayload.frequency;
    var gw_counter = normalizedPayload.counter;

    // LoRa Channel
    var value = bytes[0];
    var loraChan = value

    // Data Type
    var value = bytes[1];
    var dataType = value

    // 0x82 = Distance
    if (dataType == 0x82) {
        var value = bytes[2] << 8 | bytes[3];
        var distance = value

        // Fill Level
        var heightAboveFillLine = 0; // Distance (in millimeters) from top of fill line to bottom of KST3320
        var distanceToBottom = 4000; // Total height of the bin/object being measured in millimeters
        var calculatedPercentage;

        calculatedPercentage = 100 - (100 * ((distance - heightAboveFillLine)/distanceToBottom));

        if( calculatedPercentage >= 100) calculatedPercentage = 100;
        if( calculatedPercentage < 0 ) calculatedPercentage = 0;

        var fillLevel = calculatedPercentage;

    // 0x78 = Battery
    }else if (dataType == 0x78) {
        var value = bytes[2];
        var battery = value

    // 0x88 = GPS
    } else if (dataType == 0x88 && bytes.length == 11) {
        var value = bytes[2] << 16 | bytes[3] << 8 | bytes[4];
        if (value > 0x80000) {
            value -= 0xFFFFFF
        }
        var lat = value / 10000

        var value = bytes[5] << 16 | bytes[6] <<8 | bytes[7];
        if (value > 0x80000) {
            value -= 0xFFFFFF
        }
        var lon = value / 10000

        var location = "("+lat+","+lon+")"

        var value = bytes[8] << 16 | bytes[9] << 8 | bytes[10];
        var alt = value / 100

    // 0x88 = Extended GPS (if ADR is enabled)
    }else if (dataType == 0x88 && bytes.length == 20) {
        var value = bytes[2] << 16 | bytes[3] << 8 | bytes[4];
        if (value > 0x80000) {
            value -= 0xFFFFFF
        }
        var lat = value / 10000

        var value = bytes[5] << 16 | bytes[6] <<8 | bytes[7];
        if (value > 0x80000) {
            value -= 0xFFFFFF
        }
        var lon = value / 10000

        var location = "("+lat+","+lon+")"

        var value = bytes[8] << 16 | bytes[9] << 8 | bytes[10];
        var alt = value / 100

        var value = bytes[11] << 24 | bytes[12] << 16 | bytes[13] << 8 | bytes[14];
        var accuHorz = value / 1000

        var value = bytes[15] << 24 | bytes[16] << 16 | bytes[17] << 8 | bytes[18];
        var accuVert = value / 1000

        var value = bytes[19];
        var satellites = value

    } else {

    }

    return [
        {
            field: "LORA_CHANNEL",
            value: loraChan,
        },
        {
            field: "LPP",
            value: dataType,
        },
        {
            field: "DISTANCE",
            value: distance,
        },
        {
            field: "FILL_LEVEL",
            value: fillLevel,
        },
        {
            field: "BATTERY",
            value: battery,
        },
        {
            field: "LATITUDE",
            value: lat,
        },
        {
            field: "LONGITUDE",
            value: lon,
        },
        {
            field: "ALTITUDE",
            value: alt,
        },
        {
            field: "HORIZONTAL_ACCURACY",
            value: accuHorz,
        },
        {
            field: "VERTICAL_ACCURACY",
            value: accuVert,
        },
        {
            field: "SATELLITES",
            value: satellites,
        },
        {
            field: "LOCATION",
            value: location,
        },
        {
            field: "GW_RSSI",
            value: gw_rssi,
        },
        {
            field: "GW_SNR",
            value: gw_snr,
        },
        {
            field: "GW_DATARATE",
            value: gw_datarate,
        },
        {
            field: "GW_CHANNEL",
            value: gw_channel,
        },
        {
            field: "GW_FREQUENCY",
            value: gw_freq,
        },
        {
            field: "GW_COUNTER",
            value: gw_counter,
        }
    ];
    
}