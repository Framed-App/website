# Idea for code from https://github.com/ArneGockeln/jekyll-umlauts/blob/master/lib/jekyll-umlauts.rb
module Jekyll
	class TWLazyLoad < Generator
	  safe true
	  priority :highest
  
	  def generate(site)
  
		site.pages.each do |page|
		  page.content = replace(page.content)
		end
  
		site.posts.docs.each do |post|
		  post.content = replace(post.content)
		end
	  end
  
	  def replace(content)
		content.gsub!(/!\[(.+)\]\((.+)\)/i, '<img class=\'lazy img-fluid\' data-src=\'\2\' alt=\'\1\'><noscript><img src=\'\2\' alt=\'\1\'></noscript>')
		content
	  end
  
	end
  end
  