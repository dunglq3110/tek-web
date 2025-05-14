function Carousel() {
  return (
    <>
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg?auto=compress&cs=tinysrgb&w=900"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-caption">
              <h5>Dedicated Staffs</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                assumenda suscipit fuga unde sit inventore rerum nemo
                repellendus. Voluptates, impedit?
              </p>
              <p>
                <a href="#" className="btn btn-warning mt3">
                  Learn More
                </a>
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://media.istockphoto.com/id/1138138146/photo/rear-view-of-large-group-of-students-on-a-class-at-lecture-hall.jpg?b=1&s=612x612&w=0&k=20&c=1TATPSGC6XuQTjXx553qkhp9IBbp4LHw4EYKkEgvzqw="
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-caption">
              <h5>Elaborate Lecture Halls</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                assumenda suscipit fuga unde sit inventore rerum nemo
                repellendus. Voluptates, impedit?
              </p>
              <p>
                <a href="#" className="btn btn-warning mt3">
                  Learn More
                </a>
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=1600"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-caption">
              <h5>Quality Library Infrastructures</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                assumenda suscipit fuga unde sit inventore rerum nemo
                repellendus. Voluptates, impedit?
              </p>
              <p>
                <a href="#" className="btn btn-warning mt3">
                  Learn More
                </a>
              </p>
            </div>
          </div>
          
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}

export default Carousel;
