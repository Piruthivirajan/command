function byte(data) {
    // let buf = new Buffer.allocUnsafe(1);
    // buf.writeInt8(data)
    // return buf;
    let bytearray = []
    var buf = new Buffer.allocUnsafe(1);
    buf.writeUIntLE(data, 0, 1)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    return buf;
}
function Short(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(2);
    buf.writeUIntLE(data, 0, 2)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray.reverse();
    return buf.reverse();
}
function Integer(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeInt32LE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf.reverse();
}
function UInteger(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeUInt32LE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray.reverse();
    return buf.reverse();
}
function UInteger16(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeUInt16LE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray.reverse();
    return buf.reverse();
}
function Ascii(data) {
    let bytearray = []
    var buf = Buffer.from(data, "ascii")
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf;
}
function Float(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeFloatLE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf.reverse();
}
function Double(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(8);
    buf.writeDoubleLE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf.reverse();
}
function Int16(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeInt16LE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf.reverse();
}

module.exports = {
    byte: byte,
    Short: Short,
    Integer: Integer,
    UInteger: UInteger,
    Ascii: Ascii,
    Float: Float,
    Double: Double,
    UInteger16: UInteger16,
    Int16:Int16
}