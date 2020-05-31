module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        title: String,
        reader: String,
        image: String,
        audio: String
      }
    )
    
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    
    const audioBooks = mongoose.model("audioBooks", schema);

  return audioBooks;
};