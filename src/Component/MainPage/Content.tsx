import React from "react";
import "./Content.scss";

function Content() {
  const model_img: string = `${process.env.PUBLIC_URL}/img/model.png`;

  return (
    <div className="Content container-md ps-2 pe-2">
      <h2>Overview</h2>
      <p>
        Parks Victoria Burnley Depot have a responsibility to manage litter in
        the lower Yarra and Maribyrnong Rivers. Litter management is achieved
        through a network of 20 litter traps that passively trap and concentrate
        litter for collection by Waterways Rangers. The existing network of
        traps has been operating for over 20 years. To help reduce manual
        efforts of counting litter and analyze data, an AI solution on computer
        vision method will be used to effectively count objects in image.
      </p>
      <p>
        This project is as a part of 8 weeks internship sponsored by Victoria
        University and Park Victoria. The main objective of this project is to
        create a concept for data analysis method on litter collect from trap
        box.
      </p>
      <h2>Features</h2>
      <p>
        Despite of the limited samples collected (152 images in total) in two
        months, the model performs relatively well with 85% accuracy on plastic
        bottles and 88% on helmet. Model can also count the number of ball
        (tennis ball, dog ball, etc.) with 74% accuracy. For foam and spray can,
        the model performs less accurate with only 60%.
      </p>
      <p>
        For others categories. The data is too scarce and not feasible for this
        model. However, the accuracy can be improved when more sample is ready
        and more categories.
      </p>
      <p>The running time of the program is about 10 seconds per image.</p>
      <h2>About the model</h2>
      <div className="model-image d-flex">
        <img src={model_img} alt="model architexture" />
        <a href="https://arxiv.org/pdf/1811.10452.pdf">
          <i>Context-aware Network</i>
        </a>
      </div>
      <p className="mt-3 mb-5">
        The AI model that we use which a very similar approach has been designed
        for crowd counting. This kind of model is better than detection model
        when dealing with very small object and lots of occlusion. We have to
        fine-tune image size input and depth of architecture for each class. We
        also implement image tiling techniques to split image in to sub images
        to increase input resolution.
      </p>
    </div>
  );
}

export default Content;
