import { Fragment, useEffect, useRef, useState } from "react";
// import bot1 from "./assets/bot1.jpg";
import send from "../assets/send.png";
import { Chat } from "../enum/EnumList";
import ThreeDotsBouncing from "./ThreeDotsBouncing";
import axios from "axios";
import { urlMainFlow } from "../urlEndpoints";
// import { v4 as uuidv4 } from "uuid";

// const dummyChatData = [
//   {
//     role: Chat.SYSTEM,
//     message:
//       "Hai kenalin aku MILA (Mega Intelligent Assistant), yang selalu siap membantu kamu untuk memberikan informasi dan layanan Bank Mega",
//   },
// ];

/**
 * INI ENDPOINT VERSI 1, Ide awalnya masih mengikuti chat whatsapp manual
 */

export default function Version1() {
  const myRef = useRef<any>(null);
  const textAreaRef = useRef<any>(null);
  const [chatData, setChatData] = useState<any>([]);
  const [inputUser, setInputUser] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    //TODO: delete this later, use isLoading in a more proper way!
    console.log("isLoading: ", isLoading);

    // setChatData(dummyChatData);
  }, []);

  // useEffect(() => {
  //   axios.get(urlGreetings).then((res) => {
  //     console.log("response url test: ", res);
  //     setChatData([
  //       {
  //         role: Chat.SYSTEM,
  //         message: res.data.data,
  //       },
  //     ]);
  //   });
  // }, []);

  useEffect(() => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  const hitEndpoint = (input: string) => {
    setIsLoading(false);

    const reqBody = {
      user_prompt: input,
    };

    console.log("reqBody", reqBody);

    axios
      .post(urlMainFlow, reqBody)
      .then((res) => {
        console.log("web mainflow response", res.data.answer);

        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          const stringResult: any = [];
          res.data.data.forEach((e: string) => {
            stringResult.push({
              role: Chat.SYSTEM,
              message: e,
            });
          });
          setChatData((prev: any) => [...prev, ...stringResult]);
        } else {
          setChatData((prev: any) => [
            ...prev,
            {
              role: Chat.SYSTEM,
              message: res.data.answer,
            },
          ]);
        }
      })
      .catch((err) => {
        console.log("urlMainFlow", err);
        setChatData((prev: any) => [
          ...prev,
          // {
          //   role: Chat.SYSTEM,
          //   message: `gagal meresponse: ${inputUser}`,
          // },
          {
            role: Chat.SYSTEM,
            message:
              "Mohon Maaf Mila tidak tahu, tapi Mila akan terus belajar untuk memberikan pengalaman terbaik bagimu",
          },
        ]);
      });
  };

  const addChatUser = (input: string) => {
    setIsLoading(true);
    if (input.length > 0 && input !== "\n") {
      const prev = Array.from(chatData);

      prev.push({ role: Chat.USER, message: input });
      console.log("prev: ", prev);

      setInputUser("");
      setChatData(prev);

      hitEndpoint(input);
    }
  };
  return (
    <>
      <div className="h-screen mx-auto">
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
                        <div className={`chat-bubble bg-orange-400 text-white`}>
                          {data.message === "..." ? (
                            <ThreeDotsBouncing />
                          ) : (
                            <>{data.message}</>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="chat-bubble bg-[#d9fdd3] text-black">
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
                className="outline-none w-full p-0 resize-none text-sm bg-transparent"
                name="inputUser"
                ref={textAreaRef}
                onFocus={(e) => e.persist()}
                placeholder="Type message"
                value={inputUser}
                onChange={(e) => {
                  if (e.target.value !== "\n") {
                    setInputUser(e.target.value);
                  }
                }}
                onKeyUp={(e) => {
                  e.preventDefault();
                  if (e.key === "Enter" && e.shiftKey == false) {
                    addChatUser(inputUser.substring(0, inputUser.length - 1));
                  }
                }}
              />
              <img
                src={send}
                className="h-[24px] w-[24px] block m-auto cursor-pointer"
                onClick={() => {
                  addChatUser(inputUser);
                  textAreaRef.current.focus();
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
