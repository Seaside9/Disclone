if @messageable.class == Dm
  json.directMessages do
    json.partial! 'api/dms/dm.json.jbuilder', dm: @messageable, messages: @messages.map{|message| message.id}
  end
else
  # render channel;
end

json.messages do
  @messages.each do |message|
    json.partial! 'api/messages/message.json.jbuilder', message: message
  end
end
