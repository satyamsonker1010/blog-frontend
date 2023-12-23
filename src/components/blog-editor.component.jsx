import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
const BlogEditor = () => {
  let blogBannerRef = useRef();

  // Impoart all states value of blog
  let {
    blogState,
    blogState: { title, banner, content, tags, des },
    setBlogState,
  } = useContext(EditorContext);

  useEffect(() => {
    let editor = new EditorJS({
      holderId:"textEditor",
      data:"",
      tools:tools,
      placeholder:"Let's write an awesome story"
    });
  }, []);

  // Banner Upload functionlity
  const handelBannerUpload = (e) => {
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded");
            setBlogState({ ...blogState, banner: url });
          }
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          return toast.error(error);
        });
    }
  };

  // When click enter button on the title
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  // Height automatic change of the title
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlogState({ ...blogState, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black w-full line-clamp-1">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full ">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80 ">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  hidden
                  onChange={handelBannerUpload}
                />
              </label>
            </div>
            {/* Text area for title */}
            <textarea
              placeholder="Blog Title"
              className="w-full h-15 text-3xl font-medium mt-5 outline-none resize-none placeholder:opacity-80  leading-tight"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-2" />

            {/* Text Editor Part */}
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
