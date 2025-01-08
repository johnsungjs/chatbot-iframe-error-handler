import { Fragment, useEffect, useRef, useState } from "react";
import send from "../assets/send.png";
import { Chat } from "../enum/EnumList";
import ThreeDotsBouncing from "./ThreeDotsBouncing";
import axios from "axios";
import { urlMainFlow } from "../urlEndpoints";

const dummyChatData = [
  {
    role: Chat.SYSTEM,
    message:
      "Hai kenalin aku MILA (Mega Intelligent Assistant), yang selalu siap membantu kamu untuk memberikan informasi dan layanan Bank Mega",
  },
];

/**
 * INI ENDPOINT VERSI 2, ceritanya mau ideal, setiap loading itu ada animasinya, cek aja skenario kayak begini tapi chatnya jangan ditabrak dulu
 */

export default function Version2() {
  const myRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [chatData, setChatData] = useState<any>([]);
  const [inputUser, setInputUser] = useState<string>("");

  useEffect(() => {
    setChatData(dummyChatData);
  }, []);

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  const hitEndpoint = (input: string, savedIndex: number) => {
    const reqBody = {
      inbound_message: input,
      user_id: "test123",
      media: "web",
    };

    console.log("reqBody", reqBody);

    axios
      .post(urlMainFlow, reqBody)
      .then((res) => {
        console.log("urlMainFlow", res);
        setChatData((prev: any) => {
          const prev2 = Array.from(prev);
          console.log("prev2: ", prev2);

          prev2[savedIndex] = {
            role: Chat.SYSTEM,
            message: res.data.data,
          };

          return prev2;
        });
      })
      .catch((err) => {
        console.log("urlMainFlow", err);
        setChatData((prev: any) => {
          const prev2 = Array.from(prev);
          console.log("prev2: ", prev2);

          prev2[savedIndex] = {
            role: Chat.SYSTEM,
            message: `gagal response: ${inputUser}`,
          };

          return prev2;
        });
      });
  };

  const addChatUser = (input: string) => {
    if (input.length > 0 && input !== "\n") {
      let prev = Array.from(chatData);
      const savedIndex = prev.length + 1;

      prev.push({ role: Chat.USER, message: input });

      if (savedIndex > chatData.length) {
        prev[savedIndex] = { role: Chat.SYSTEM, message: "..." };
      } else {
        console.log("masuk else");
        prev[chatData.length + 1] = { role: Chat.SYSTEM, message: "..." };
      }

      setInputUser("");
      setChatData(prev);

      hitEndpoint(input, savedIndex);
    }
  };

  const resizeTextArea = () => {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = "auto";
    const autoHeight = textAreaRef.current.scrollHeight;
    const setHeight = autoHeight > 360 ? 360 : autoHeight;
    textAreaRef.current.style.height = `${setHeight}px`;
  };

  const resetTextArea = () => {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = "auto";
  };

  useEffect(() => {
    resizeTextArea();
    window.addEventListener("resize", resizeTextArea);
  }, []);

  return (
    <>
      <div className="max-w-[600px] h-screen mx-auto">
        {/* CHAT START */}
        <div className={`opacity-100 w-full h-full`}>
          {/* PROFILE SECTION START */}
          <div className="flex flex-col h-full">
            <div className="px-2 flex h-[60px] border-b-2 items-center bg-orange-400 text-white text-xs">
              {/* <div>profile</div> */}
              <img src="/images/mila.png" className="w-[50px]" />
              <div className="w-full">
                <p>MILA</p>
                <p>MEGA INTELLIGENT ASSISTANT</p>
              </div>
            </div>
            {/* PROFILE SECTION END */}
            {/* CHAT SECTION START */}
            <div className="px-2 pt-2 h-full overflow-auto text-sm">
              {chatData &&
                chatData.length > 0 &&
                chatData.map((data: any, index: number) => (
                  <Fragment key={index}>
                    {data.role === Chat.SYSTEM ? (
                      <div className="flex justify-start">
                        <img
                          src="/images/mila.png"
                          className="rounded-full w-[30px] h-[30px]"
                        />
                        <div
                          className={
                            "chat-bubble bg-orange-400 text-white overflow-auto break-words"
                          }
                        >
                          {data.message === "..." ? (
                            <ThreeDotsBouncing />
                          ) : (
                            <>{data.message}</>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="chat-bubble bg-[#d9fdd3] text-black overflow-auto break-words">
                          {data.message}
                        </div>
                      </div>
                    )}
                  </Fragment>
                ))}
              <div ref={myRef} />
            </div>
            {/* CHAT SECTION END */}
            {/* CHAT BOTTOM SECTION START */}
            <div className="border-t-2 px-2 py-1 border-[#CCCCCC] flex bg-white">
              <textarea
                rows={1}
                className="outline-none w-full py-2 resize-none text-sm bg-transparent"
                name="inputUser"
                ref={textAreaRef}
                onFocus={(e) => e.persist()}
                placeholder="Type message"
                value={inputUser}
                onChange={(e) => {
                  resizeTextArea();
                  if (e.target.value !== "\n") {
                    setInputUser(e.target.value);
                  }
                }}
                onKeyUp={(e) => {
                  e.preventDefault();
                  if (e.key === "Enter" && e.shiftKey == false) {
                    resetTextArea();
                    addChatUser(inputUser.substring(0, inputUser.length - 1));
                  }
                }}
              />
              <img
                src={send}
                className="h-[24px] w-[24px] block m-auto cursor-pointer"
                onClick={() => {
                  addChatUser(inputUser);
                  textAreaRef.current && textAreaRef.current.focus();
                }}
              />
            </div>
            {/* CHAT BOTTOM SECTION END */}
          </div>
        </div>
        {/* CHAT ENDS */}
      </div>
    </>
  );
}
