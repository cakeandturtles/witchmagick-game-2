function RoomIllusion(y, x, z, y_offset, x_offset, z_offset){
    this.room_y = y;
    this.room_x = x;
    this.room_z = z;
    this.y_offset = defaultTo(y_offset, 0);
    this.x_offset = defaultTo(x_offset, 0);
    this.z_offset = defaultTo(z_offset, 0);
}