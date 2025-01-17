import React, {useEffect, useState} from "react";
import styled from "styled-components"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Image,
    Button, FormControl, FormLabel, Input, FormHelperText,
} from '@chakra-ui/react'
import {Select, Progress} from '@chakra-ui/react'
import axios from "axios";
import {AiOutlinePlus} from 'react-icons/ai'

const Directions = styled.div`
  font-weight: 500;
  font-size: 40px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PlusIcon = styled(AiOutlinePlus)`
  font-size: 80px;
`
const Container = styled.div`
  width: 200px;
  height: 225px;
  border: #57657e solid 2px;
  border-radius: 4px;
  padding: .5rem;
  transition: box-shadow ease-in-out .2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-radius ease-in-out .25s;
  transition: background-color ease-in-out .25s;
  color: ${props => props.theme.colors.primary};

  &:hover {
    border-radius: 20px;
    background-color: #48fdce;
    color: ${props => props.theme.colors.secondary};
  }
`;

const PopButton = styled.button`
  width: 100%;
  height: 100%;
  border: solid 1px;
  border-radius: 4px;
  padding: .5rem;
  background-color: ${props => props.theme.colors.blue};
  transition: box-shadow ease-in-out .1s;
  font-weight: 500;
  color: black;

  &:hover {
    box-shadow: 3px 3px 0px #000000;
  }
`

const StyledSelect = styled(Select)`
  margin-bottom: 20px;
`

const PreviewButton = styled(Button)`
  margin-top: 20px;
`
const ChromeTag = styled.a`
  color: orange;
`

function makeFullURL(url) {
    // Check if the URL already starts with "http://" or "https://"
    if (url.startsWith("http://") || url.startsWith("https://")) {
        // If so, return the URL with the method
        return url;
    } else {
        // Otherwise, add "http://" to the beginning of the URL and return with the method
        return "http://" + url;
    }
}

const WebsiteInput = ({url, setUrl}) => {
    const handleInputChange = (e) => {
        setUrl(e.target.value)
    }
    return (
        <FormControl>
            <FormLabel>Website URL</FormLabel>
            <Input type='url' value={url} onChange={handleInputChange}/>
            <FormHelperText color={'#f4fdf9'}>or Try our&nbsp;
                <ChromeTag target="_blank"
                           href="https://chrome.google.com/webstore/detail/chimpbase-page-collector/igcljiaagpkbcamaceaekidclckkmnkp">Chrome
                    extension</ChromeTag> for an enhanced experience. The extension ensures
                that all visible content is
                transcribed accurately and bypasses any firewall restrictions
            </FormHelperText>
        </FormControl>
    )
}

const YoutubeThumbnail = styled.div`
  margin-bottom: 5px;
`
const YoutubeInput = ({url, setUrl, title, setTitle, fileType}) => {
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    useEffect(() => {
        const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setThumbnailUrl(data.thumbnail_url);
                setTitle(data.title)
            })
            .catch(error => {

            });
    }, [url, fileType])
    const handleInputChange = (e) => {
        setUrl(e.target.value)
    }

    const setNewTitle = (e) => {
        setTitle(e.target.value)
    }

    return (
        <FormControl>
            <FormLabel>YouTube Video URL</FormLabel>
            <Input type='url' value={url} onChange={handleInputChange}/>
            <FormHelperText color={'#f4fdf9'}>
                Please make sure that the YouTube video URL you enter is publicly accessible.
            </FormHelperText>
            <br/>
            <YoutubeThumbnail>
                {thumbnailUrl && <Image
                    src={thumbnailUrl}
                    alt='Thumbnail for Youtube Video'
                    borderRadius='lg'
                />}
            </YoutubeThumbnail>
            {url &&
                <>
                    <FormLabel>Video Title</FormLabel>
                    <Input type='text' value={title} onChange={setNewTitle}/>
                </>
            }
        </FormControl>
    )
}

const DropBox = styled.div`
  border: 1px dashed #57657e;
  padding: 20px;
`

const DropText = styled.p`
  font-weight: 600;
  margin-bottom: 20px;
`

const FileInformation = styled.p`
  margin-top: 5px;
`
const StyledOption = styled.option`

  background-color: #242933;
  color: #000;

  &:hover {
    background-color: #2D3542; // Custom hover background color
  }
`

const ProgressContainer = styled.div`
  margin-top: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
`
const ProgressText = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`

export default function Upload({handleFile}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const {isOpen, onOpen, onClose} = useDisclosure("");
    const hiddenFileInput = React.useRef(null);
    const hiddenVideoFileInput = React.useRef(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);
    const [isSending, setIsSending] = useState(false)
    const [title, setTitle] = useState('');
    const urlChecker = React.useRef(null)

    const sendS3 = async (file, fileType) => {
        if (!file) {
            console.log("no file was found")
            return
        }

        // add code to disable submit and upload
        setIsSending(true);

        const requestObject = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "fileName": file.name,
                "fileType": file.type,
            })
        }

        let uploadID

        if (fileType === 'pdf') {
            await fetch('/api/getUploadURL', requestObject)
                .then(res => res.json())
                .then(data => {
                    uploadID = data["fileName"]
                    fetch(data["signedUrl"], {
                        headers: {'content-type': file.type},
                        method: 'PUT',
                        body: file,
                    }).then((res) => {
                        setIsSending(false);
                        return res.text()
                    }).then((txt) => {
                        console.log(txt)
                    })
                })
        } else if (fileType === 'mp4') {
            await fetch('/api/getVideoUploadURL', requestObject)
                .then(res => res.json())
                .then(data => {
                    uploadID = data["fileName"]
                    const options = {
                        headers: {'content-type': file.type},
                        onUploadProgress: function (progressEvent) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgress(percentCompleted);
                            console.log(percentCompleted);
                        }
                    };
                    axios.put(data["signedUrl"], file, options)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        }).finally(() => {
                        console.log("done");
                        setIsSending(false);
                    });
                })
        }
        return uploadID
    }

    const closeModal = () => {
        setUrl('')
        setFileType('')
        setSelectedFile(null)
        onClose()
    }

    const handleSelectFileType = (e) => {
        setFileType(e.target.value)
    }

    const handleFileButtonClick = () => {
        hiddenFileInput.current.click();
    };

    const handleVideoFileButtonClick = () => {
        hiddenVideoFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        if (!fileUploaded) return;
        const fileExtension = fileUploaded.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'pdf') {
            alert('Please select a PDF file.');
            return;
        }
        setSelectedFile(fileUploaded)
    };

    const handleVideoFileChange = event => {
        const fileUploaded = event.target.files[0];
        if (!fileUploaded) return;
        const fileExtension = fileUploaded.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'mp4') {
            alert('Please select a MP4 file.');
            return;
        }
        setSelectedFile(fileUploaded)
    };

    const handleFileDrop = event => {
        event.preventDefault();
        const fileUploaded = event.dataTransfer.files[0];
        const fileExtension = fileUploaded.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'pdf') {
            alert('Please select a PDF file.');
            return;
        }
        setSelectedFile(fileUploaded)
    };

    const handleVideoFileDrop = event => {
        event.preventDefault();
        const fileUploaded = event.dataTransfer.files[0];
        const fileExtension = fileUploaded.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'mp4') {
            alert('Please select a mp4 file.');
            return;
        }
        setSelectedFile(fileUploaded)
    };

    const handleDragOver = event => {
        event.preventDefault();
    };

    const renderSelectedFile = () => {
        if (selectedFile) {
            return <FileInformation>Selected file: {selectedFile.name}</FileInformation>;
        } else {
            return <></>
        }
    };

    const uploadDocument = async () => {
        if (fileType === 'url') {
            let fullURL = makeFullURL(url)
            console.log(fullURL)
            axios.post('/api/user/add_website_document', {url: fullURL,}).then((res) => {
                const {key, fileName} = res.data
                handleFile(fileName, fileType, key);
                closeModal()
            }).catch((err) => {
                console.error(err)
            })
        } else if (fileType === 'youtube') {
            axios.post('/api/user/add_youtube_video', {url, title}).then((res) => {
                const {key, url, title} = res.data
                handleFile(title, fileType, key, url);
                closeModal()
            }).catch((err) => {
                console.error(err)
            })
            console.log(url)
        } else if (fileType === 'pdf') {
            const uploadID = await sendS3(selectedFile, fileType);
            console.log(uploadID);
            handleFile(selectedFile, fileType, uploadID);
            closeModal();
        } else if (fileType === 'mp4') {
            const uploadID = await sendS3(selectedFile, fileType);
            console.log(uploadID);
            console.log(fileType);
            handleFile(selectedFile, fileType, uploadID);
        } else {
            closeModal()
        }

    }

    useEffect(() => {
        if (progress === 100) {
            closeModal()
            setProgress(0)
        }
    }, [progress])

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent color={'white'} bg={'#242933'}
                          sx={{'border': 'solid', 'borderWidth': '2px', 'borderColor': '#57657e'}}>
                <ModalHeader>New</ModalHeader>
                <ModalBody>
                    <StyledSelect value={fileType} onChange={handleSelectFileType}
                                  sx={{borderColor: '#57657e', backgroundColor: '#242933'}}
                                  placeholder='Choose information type'>
                        <StyledOption value='pdf'>Document (PDF)</StyledOption>
                        <StyledOption value='url'>Website link</StyledOption>
                        <StyledOption value='youtube'>Youtube Video</StyledOption>
                        <StyledOption value='mp4'>MP4 File</StyledOption>
                    </StyledSelect>
                    {
                        fileType === 'pdf' && <>
                            <DropBox onDrop={handleFileDrop} onDragOver={handleDragOver}
                            > <DropText>Drag and drop a PDF file here or</DropText>

                                <PopButton bg={'white'} onClick={handleFileButtonClick}>
                                    Select PDF
                                </PopButton>
                                <input
                                    type="file"
                                    ref={hiddenFileInput}
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                    style={{display: 'none'}}
                                />
                            </DropBox>
                            {renderSelectedFile()}
                        </>
                    }
                    {
                        fileType === 'url' &&
                        <>
                            <WebsiteInput url={url} setUrl={setUrl}/>
                        </>
                    }
                    {
                        fileType === 'youtube' &&
                        <>
                            <YoutubeInput fileType={fileType} url={url} setUrl={setUrl} title={title}
                                          setTitle={setTitle}/>
                        </>
                    }
                    {
                        fileType === 'mp4' && <>
                            <DropBox onDrop={handleVideoFileDrop} onDragOver={handleDragOver}
                            > <DropText>Drag and drop a MP4 file here or</DropText>

                                <PopButton bg={'white'} onClick={handleVideoFileButtonClick}>
                                    Select MP4
                                </PopButton>
                                <input
                                    type="file"
                                    ref={hiddenVideoFileInput}
                                    onChange={handleVideoFileChange}
                                    accept="video/mp4"
                                    style={{display: 'none'}}
                                />
                            </DropBox>
                            {renderSelectedFile()}

                            {
                                progress !== 0 &&
                                <ProgressContainer>
                                    <ProgressText>
                                        Uploading Video!
                                    </ProgressText>
                                    <Progress size='xs' value={progress} colorScheme='green'/>
                                </ProgressContainer>
                            }
                        </>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme={'blue'} mr={3} onClick={uploadDocument} isDisabled={isSending}>
                        Submit
                    </Button>
                    <Button colorScheme={'red'} mr={3} onClick={closeModal} isDisabled={isSending}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Container onClick={onOpen}>
            <Directions><PlusIcon/><span>
                Add
            </span></Directions>
        </Container>
    </>);
}